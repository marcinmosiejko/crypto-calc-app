import {
  API_URL,
  BREAK_POINT_MOBILE,
  DEFAULT_CRYPTO,
  DEFAULT_INTERVAL,
  DEFAULT_INVESTING,
  DEFAULT_STARTING_DATE,
  INVESTING_LIMIT_BOTTOM,
  INVESTING_LIMIT_TOP,
  PRIMARY_COLOR,
  SECONDARY_COLOR,
} from './config.js';
import {
  AJAX,
  createDataCryptoValue,
  createDataInvested,
  createDataPointsInvestedSummary,
  createLabels,
  getDataPointsInvested,
  isBefore,
  isMoreThenOneMonthBeforeToday,
  formatDate,
} from './helpers.js';

export const state = {
  // Needed to render summary only when form was already submitted and data fetched at least once
  mobile: true,
  // Default view = input as this will be default view when clicking on calc in main menu until other view will be selected
  calcView: 'input',
  formSubmitted: false,

  userLocale:
    navigator.userLanguage ||
    (navigator.languages &&
      navigator.languages.length &&
      navigator.languages[0]) ||
    navigator.language ||
    navigator.browserLanguage ||
    navigator.systemLanguage ||
    'en-US',

  // Initial data used to fill calc form, replaced with user input after first submition
  userInput: {
    investing: DEFAULT_INVESTING,
    crypto: DEFAULT_CRYPTO,
    interval: DEFAULT_INTERVAL,
    startingDate: DEFAULT_STARTING_DATE,
  },

  APIdata: {},

  summary: {},

  oldestDateAvailable: {
    bitcoin: '04.28.2013',
    ethereum: '08.07.2015',
    binancecoin: '09.16.2017',
    solana: '04.11.2020',
  },

  chartData: {},
};

///////////////////////////////////////////////////////////
/// STATE DATA
///////////////////////////////////////////////////////////

export const createUserInputObject = function (formData) {
  state.userInput = formData;
  state.userInput.investing = +state.userInput.investing;
};

export const loadAPIData = async function () {
  try {
    const startingDateUNIX =
      new Date(state.userInput.startingDate).getTime() / 1000;

    const historicalData = await AJAX(
      `${API_URL}/coins/${
        state.userInput.crypto
      }/market_chart/range?vs_currency=USD&from=${startingDateUNIX}&to=${Date.now()}`
    );
    // Too recent date generates no historical data -> throw error
    if (
      !historicalData.prices.length ||
      !isMoreThenOneMonthBeforeToday(state.userInput.startingDate)
    )
      throw new Error(
        `Too recent date, pick one before ${formatDate(
          Date.today().addMonths(-1),
          state.userLocale
        )}`
      );

    const currentPriceData = await AJAX(
      `${API_URL}/simple/price?ids=${state.userInput.crypto}&vs_currencies=USD`
    );

    state.APIdata = createAPIdataObject(historicalData, currentPriceData);
    state.summary = createSummaryObject(state.APIdata, state.userInput);
    state.chartData = createChartDataObject();
  } catch (err) {
    throw err;
  }
};

export const createChartDataObject = function () {
  const {
    userLocale,
    APIdata: { currentPrice },
    summary: { totalCryptoAmount, dataPointsInvestedSummary },
  } = state;

  const labels = createLabels(dataPointsInvestedSummary, userLocale);
  const dataCryptoValue = createDataCryptoValue(
    currentPrice,
    totalCryptoAmount,
    dataPointsInvestedSummary
  );
  const dataInvested = createDataInvested(dataPointsInvestedSummary);

  const datasets = [
    {
      label: 'crypto value',
      data: dataCryptoValue,
      fill: false,
      backgroundColor: PRIMARY_COLOR,
      borderColor: PRIMARY_COLOR,
      tension: 0.1,
    },
    {
      label: 'invested',
      data: dataInvested,
      fill: false,
      backgroundColor: SECONDARY_COLOR,
      borderColor: SECONDARY_COLOR,
      tension: 0.1,
    },
  ];

  const chartData = { labels, datasets };

  return chartData;
};

export const updateFormSubmitted = function () {
  state.formSubmitted = true;
};

export const updateMobileView = function (calcWidth) {
  // keeps info if previous view was mobile
  state.mobilePrevious = state.mobile;
  // -10 main element has 10px less width then screen width
  state.mobile = calcWidth <= BREAK_POINT_MOBILE - 10 ? true : false;
};

export const updateCalcView = function (view) {
  state.calcView = view;
};

export const updateSelectedCrypto = function (selectedCrypto) {
  state.userInput.crypto = selectedCrypto;
};

const createAPIdataObject = function (historicalData, currentPriceData) {
  const dataPoints = historicalData.prices;
  const startingDateUNIX = dataPoints[0][0];

  const currentPrice = currentPriceData[`${state.userInput.crypto}`]['usd'];

  return { startingDateUNIX, currentPrice, dataPoints };
};

const createSummaryObject = function (APIdata, userInput) {
  const dataPointsInvested = getDataPointsInvested(APIdata, userInput.interval);
  // Create array with dataPointsInvestedSummary by looping through dataPointsDatePrice and accumulating each data point into array
  const dataPointsInvestedSummary = createDataPointsInvestedSummary(
    dataPointsInvested,
    userInput
  );

  const totalCryptoAmount =
    dataPointsInvestedSummary.at(-1).cryptoAmountAccumulated;
  const investments = dataPointsInvestedSummary.length;
  const invested = dataPointsInvestedSummary.at(-1).investedAccumulated;
  const value = totalCryptoAmount * APIdata.currentPrice;
  const roi =
    value < invested
      ? -Math.round(((invested - value) / invested) * 100)
      : Math.round(((value - invested) / invested) * 100);

  return {
    roi,
    value,
    invested,
    investments,
    totalCryptoAmount,
    dataPointsInvestedSummary,
  };
};

///////////////////////////////////////////////////////////
/// DATA VALIDATION
///////////////////////////////////////////////////////////

export const validateUserInput = function (formData) {
  // If amount investing below 10 and above 100 000$
  if (
    formData.investing < INVESTING_LIMIT_BOTTOM ||
    formData.investing > INVESTING_LIMIT_TOP
  )
    throw new Error(
      `Only values between ${INVESTING_LIMIT_BOTTOM} to ${INVESTING_LIMIT_TOP} USD are accepted`
    );

  // If selected date older then oldestDateAvailable
  if (
    isBefore(formData.startingDate, state.oldestDateAvailable[formData.crypto])
  )
    throw new Error(
      `Too old date, pick one between ${formatDate(
        Date.parse(state.oldestDateAvailable[formData.crypto]),
        state.userLocale
      )} and ${formatDate(Date.today().addMonths(-1), state.userLocale)}`
    );
};

export const isInvestingInputCorrect = function (input) {
  state.userInput.investing = +input;
  // When there's 'e' at the beginning or the end of input, we get empty string, which when converted to a number === 0 and that's what we check for to eliminate that edge case
  if (+input === 0) return false;
  // When there's 'e' within input (not first or last), we check if input uncludes e
  if (input.includes('e')) return false;

  if (+input < INVESTING_LIMIT_BOTTOM || +input > INVESTING_LIMIT_TOP)
    return false;

  return true;
};

export const isDateInputCorrect = function (input) {
  state.userInput.startingDate = input;
  if (!Date.parse(input)) return false;

  if (isBefore(input, state.oldestDateAvailable[state.userInput.crypto]))
    return false;

  if (!isMoreThenOneMonthBeforeToday(input)) return false;

  return true;
};
