import {
  API_URL,
  DEFAULT_INVESTING,
  DEFAULT_CRYPTO,
  DEFAULT_INTERVAL,
  DEFAULT_STARTING_DATE,
  PRIMARY_COLOR,
  SECONDARY_COLOR,
} from './config.js';
import { AJAX, getDataPointsInvested } from './helpers.js';

// random test data
export const state = {
  // Needed to render summary only when form was already submitted at least once
  formSubmitted: false,

  // Initial data used to fill calc form, replaced with user input after first submition
  userInput: {
    investing: DEFAULT_INVESTING,
    crypto: DEFAULT_CRYPTO,
    interval: DEFAULT_INTERVAL, // 1w - week, 2w - 2 weeks, 1m - 1 month
    startingDate: DEFAULT_STARTING_DATE,
  },

  APIdata: {
    // startingDateUNIX: '04.30.2018',
    currentPrice: 23987,
    // dataPoints: [
    //   { '04.28.2015': 2047 },
    //   { '05.28.2015': 2147 },
    //   { '06.28.2015': 2547 },
    //   { '07.28.2015': 1747 },
    //   { '08.28.2015': 2947 },
    //   { '09.28.2015': 3147 },
    // ],
  },

  summary: {
    // value: 1865670.0,
    // invested: 300,
    // investments: 4,
    // roi: 3075,
    // totalCryptoAmount: 0,
    // dataPointsInvested: [],
  },

  oldestDataAvailable: {
    bitcoin: '04.28.2013',
    ethereum: '04.28.2016',
    binancecoin: '04.28.2018',
    solana: '04.28.2017',
  },
};

export const validateUserInput = function (data) {
  return true;
};

export const createUserInputObject = function (formData) {
  state.userInput = formData;
  state.userInput.investing = +state.userInput.investing;
  state.formSubmitted = true;
};

export const loadAPIData = async function () {
  try {
    const startingDateUNIX =
      new Date(state.userInput.startingDate).getTime() / 1000;

    const historicalData = await AJAX(
      `${API_URL}/coins/${state.userInput.crypto}/market_chart/range?vs_currency=USD&from=${startingDateUNIX}&to=1661421999`
    );
    const currentPriceData = await AJAX(
      `${API_URL}/simple/price?ids=${state.userInput.crypto}&vs_currencies=USD`
    );

    state.APIdata = createAPIdataObject(historicalData, currentPriceData);
    state.summary = createSummaryObject(state.APIdata, state.userInput);
  } catch (err) {
    throw err;
  }
};

export const createChartDataObject = function () {
  if (!state.summary.totalCryptoAmount) return;

  const { currentPrice } = state.APIdata;
  const { totalCryptoAmount, dataPointsInvestedSummary } = state.summary;

  const labels = dataPointsInvestedSummary.map(dataPoint =>
    Date.parse(dataPoint.date).toString('MM.yy')
  );
  labels.push(Date.today().toString('MM.yy'));

  const dataCryptoValue = dataPointsInvestedSummary.map(
    dataPoint => dataPoint.cryptoValue
  );
  dataCryptoValue.push(currentPrice * totalCryptoAmount);

  const dataInvested = dataPointsInvestedSummary.map(
    dataPoint => dataPoint.investedAccumulated
  );
  dataInvested.push(dataPointsInvestedSummary.at(-1).investedAccumulated);

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

  state.chartData = chartData;
};

const createAPIdataObject = function (historicalData, currentPriceData) {
  const dataPoints = historicalData.prices;
  const startingDateUNIX = historicalData.prices[0][0];

  const currentPrice = currentPriceData[`${state.userInput.crypto}`]['usd'];

  return { startingDateUNIX, currentPrice, dataPoints };
};

const createSummaryObject = function (APIdata, userInput) {
  const dataPointsInvested = getDataPointsInvested(APIdata, userInput.interval);

  // Create array with dataPointsInvestedSummary by looping through dataPointsDatePrice and accumulating each data point into array
  const dataPointsInvestedSummary = dataPointsInvested.reduce(
    (accArr, { date, price }) => {
      const cryptoAmountBought = +(userInput.investing / price).toFixed(6);
      // To get accumulated amount of crypto we need to add cryptoAmountBought each iteration. To do that we have to access accumulated amount from previous iteration and that's why we're accessing last element from accumulator (accArr)
      // Starting point of accumulator is an empty array, so to avoid accessing content of element that doesn't exist we have to check if it exists
      // If it doesn't exist, it's a first iteration and accumulated amoutn of crypto will just be cryptoAmountBought
      const cryptoAmountAccumulated = accArr.at(-1)
        ? +(accArr.at(-1).cryptoAmountAccumulated + cryptoAmountBought).toFixed(
            6
          )
        : +cryptoAmountBought.toFixed(6);

      const investedAccumulated = accArr.at(-1)
        ? accArr.at(-1).investedAccumulated + userInput.investing
        : userInput.investing;

      const cryptoValue = +(cryptoAmountAccumulated * price).toFixed(2);

      // Spread array from previus iteration and add current iteration data point object
      return [
        ...accArr,
        {
          date,
          price,
          cryptoAmountAccumulated,
          investedAccumulated,
          cryptoAmountBought,
          cryptoValue,
        },
      ];
    },
    []
  );

  const totalCryptoAmount =
    dataPointsInvestedSummary.at(-1).cryptoAmountAccumulated;
  const investments = dataPointsInvestedSummary.length;
  const invested = dataPointsInvestedSummary.at(-1).investedAccumulated;
  const value = totalCryptoAmount * APIdata.currentPrice;
  const roi = (value / invested) * 100;

  return {
    roi,
    value,
    invested,
    investments,
    totalCryptoAmount,
    dataPointsInvestedSummary,
  };
};
