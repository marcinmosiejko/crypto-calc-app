// random test data
export const state = {
  userInput: {
    investing: 300,
    crypto: 'ethereum',
    interval: '1m', // 1w - week, 2w - 2 weeks, 1m - 1 month
    startingDate: '04.30.2018',
  },

  APIdata: {
    startingDateUNIX: '04.30.2018',
    currentPrice: 23987,
    dataPoints: [
      { '04.28.2015': 2047 },
      { '05.28.2015': 2147 },
      { '06.28.2015': 2547 },
      { '07.28.2015': 1747 },
      { '08.28.2015': 2947 },
      { '09.28.2015': 3147 },
    ],
  },

  summary: {
    value: 1865670.0,
    invested: 300,
    investments: 4,
    return: 3075,
    totalCryptoAmount: 0,
    dataPointsInvested: [],
  },

  oldestDataAvailable: {
    bitcoin: '04.28.2013',
    ethereum: '04.28.2016',
    binancecoin: '04.28.2018',
    solana: '04.28.2017',
  },
};

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

const AJAX = async function (url) {
  try {
    const fetchPromise = fetch(url);

    const response = await Promise.race([fetchPromise, timeout(5)]);
    const APIdata = await response.json();

    if (!response.ok) throw new Error(`${data.message} (${res.status})`);

    return APIdata;
  } catch (err) {
    throw err;
  }
};

export const validateUserInput = function (data) {
  return true;
};

export const storeUserInput = function (formData) {
  state.userInput = formData;
};

const getSummary = function () {
  //// GET DATA POINTS OF INVESTMENT
  // Create object with dataPoints where date is a string mm/dd/yyyy
  const dataPoints = state.APIdata.dataPoints;

  // 1. Create array
  const dataPointsDateString = dataPoints.map(([date, price]) => {
    const dateString = Date.parse(new Date(date)).toString('MM.dd.yyyy');

    return [dateString, price];
  });
  // 2. Convert array to object
  const dataPointsObject = Object.fromEntries(dataPointsDateString);

  // Extract investment dataPoints by incresing date by interval specified by user until it's later then today
  const dataPointsInvested = [];
  const startingDate = state.APIdata.startingDateUNIX;
  let monthsAdded = 0;
  let dateCurrent = startingDate;
  while (dateCurrent < Date.today().getTime()) {
    const dateCurrentString = Date.parse(new Date(dateCurrent)).toString(
      'MM.dd.yyyy'
    );

    if (dataPointsObject[dateCurrentString])
      dataPointsInvested.push({
        date: dateCurrentString,
        price: dataPointsObject[dateCurrentString],
      });

    monthsAdded++;
    dateCurrent = new Date(
      Date.parse(new Date(startingDate)).addMonths(monthsAdded)
    ).getTime();
  }
  console.log(dataPointsInvested);
};

export const loadAPIData = async function () {
  try {
    const startingDateUNIX =
      new Date(state.userInput.startingDate).getTime() / 1000;

    const historicalData = await AJAX(
      `https://api.coingecko.com/api/v3/coins/${state.userInput.crypto}/market_chart/range?vs_currency=USD&from=${startingDateUNIX}&to=1661421999`
    );
    state.APIdata.dataPoints = historicalData.prices;
    state.APIdata.startingDateUNIX = historicalData.prices[0][0];

    const currentPriceData = await AJAX(
      `https://api.coingecko.com/api/v3/simple/price?ids=${state.userInput.crypto}&vs_currencies=USD`
    );
    state.APIdata.currentPrice =
      currentPriceData[`${state.userInput.crypto}`]['usd'];

    state.summary = getSummary();
  } catch (err) {
    throw err;
  }
};
