// random test data
export const state = {
  userInput: {
    investing: 300,
    crypto: 'eth',
    interval: '1m', // 1w - week, 2w - 2 weeks, 1m - 1 month
    startingDate: '28.04.2013',
  },

  dataAPI: {
    oldestDate: '28.04.2013',
    currentPrice: 23987,
    dataPoints: [
      ['28.04.2015', 2047],
      ['28.05.2015', 2147],
      ['28.06.2015', 2547],
      ['28.07.2015', 1747],
      ['28.08.2015', 2947],
      ['28.09.2015', 3147],
    ],
  },

  summary: {
    value: 1865670.0,
    invested: 300,
    investments: 4,
    return: 3075,
    totalCryptoAmount: 0,
  },
};
