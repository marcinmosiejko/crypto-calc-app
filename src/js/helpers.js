import { TIMEOUT_SEC } from './config.js';

///////////////////////////////////////////////////////////
/// GENERAL
///////////////////////////////////////////////////////////

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function (url) {
  try {
    const fetchPromise = fetch(url);

    const response = await Promise.race([fetchPromise, timeout(TIMEOUT_SEC)]);
    const APIdata = await response.json();

    if (!response.ok)
      throw new Error(`${APIdata.message} (${response.status})`);

    return APIdata;
  } catch (err) {
    throw err;
  }
};

const formatDate = function (
  date,
  locale,
  dayFormat = '2-digit',
  yearFormat = 'numeric'
) {
  const options = {
    day: dayFormat,
    month: '2-digit',
    year: yearFormat,
  };

  if (!dayFormat) delete options.day;

  return Intl.DateTimeFormat([locale, 'en-US'], options).format(date);
};

///////////////////////////////////////////////////////////
/// STATE DATA
///////////////////////////////////////////////////////////

export const getDataPointsInvested = function (APIdata, interval) {
  // UNIX date format is very precise (to the seconds / miliseconds). Due to time zone changes etc, when adding interval (1 week, 2 weeks or 1 month) we add full days to the starting date and when acessing object with keys being dates, we end up missing some dates by an hour etc.

  // Solution is to convert dates to mm/dd/yyyy format so we're not missing any data points due to time change

  const startingDateUNIX = APIdata.startingDateUNIX;
  const dataPoints = APIdata.dataPoints;
  const dataPointsObject = convertToObject(dataPoints);
  const dataPointsInvested = getDataPoints({
    startingDateUNIX,
    interval,
    dataPointsObject,
  });

  return dataPointsInvested;
};

const convertToObject = function (dataPoints) {
  // Create object with dataPoints where date is a string mm/dd/yyyy

  const dataPointsDateString = dataPoints.map(([date, price]) => {
    const dateString = Date.parse(new Date(date)).toString('MM.dd.yyyy');

    return [dateString, price];
  });
  const dataPointsObject = Object.fromEntries(dataPointsDateString);

  return dataPointsObject;
};

const getDataPoints = function ({
  startingDateUNIX,
  interval,
  dataPointsObject,
}) {
  // Extract investment dataPoints by incresing date by interval until it's later then today
  const intervalNumber = +interval.at(0);

  const dataPointsInvested = [];
  let intervalsAdded = 0;
  let dateCurrent = startingDateUNIX;
  while (dateCurrent < Date.today().getTime()) {
    const dateCurrentString = Date.parse(new Date(dateCurrent)).toString(
      'MM.dd.yyyy'
    );

    if (dataPointsObject[dateCurrentString])
      dataPointsInvested.push({
        date: dateCurrentString,
        price: +dataPointsObject[dateCurrentString].toFixed(2),
      });

    intervalsAdded += intervalNumber;

    dateCurrent = addIntverval(startingDateUNIX, interval, intervalsAdded);
  }

  return dataPointsInvested;
};

const addIntverval = function (startingDateUNIX, interval, intervalsAdded) {
  const intervalType = interval.at(1);

  if (intervalType === 'm')
    return new Date(
      Date.parse(new Date(startingDateUNIX)).addMonths(intervalsAdded)
    ).getTime();

  if (intervalType === 'w')
    return new Date(
      Date.parse(new Date(startingDateUNIX)).addWeeks(intervalsAdded)
    ).getTime();
};

export const createDataPointsInvestedSummary = function (
  dataPointsInvested,
  userInput
) {
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

  return dataPointsInvestedSummary;
};

///////////////////////////////////////////////////////////
/// CHART DATA
///////////////////////////////////////////////////////////

export const createLabels = function (dataPointsInvestedSummary, userLocale) {
  const yearFormat = '2-digit';
  const dayFormat = false;

  const labels = dataPointsInvestedSummary.map(dataPoint =>
    formatDate(Date.parse(dataPoint.date), userLocale, dayFormat, yearFormat)
  );
  labels.push(formatDate(Date.today(), userLocale, dayFormat, yearFormat));

  return labels;
};

export const createDataCryptoValue = function (
  currentPrice,
  totalCryptoAmount,
  dataPointsInvestedSummary
) {
  const dataCryptoValue = dataPointsInvestedSummary.map(dataPoint =>
    Math.round(dataPoint.cryptoValue)
  );

  dataCryptoValue.push(Math.round(currentPrice * totalCryptoAmount));

  return dataCryptoValue;
};

export const createDataInvested = function (dataPointsInvestedSummary) {
  const dataInvested = dataPointsInvestedSummary.map(dataPoint =>
    Math.round(dataPoint.investedAccumulated)
  );

  dataInvested.push(
    Math.round(dataPointsInvestedSummary.at(-1).investedAccumulated)
  );

  return dataInvested;
};

///////////////////////////////////////////////////////////
/// VALIDATION
///////////////////////////////////////////////////////////

export const isMoreThenOneMonthBeforeToday = function (date) {
  if (Date.compare(Date.parse(date), Date.today().addMonths(-1)) === -1)
    return true;

  return false;
};

export const isBefore = function (date1, date2) {
  if (Date.compare(Date.parse(date1), Date.parse(date2)) === -1) return true;

  return false;
};
