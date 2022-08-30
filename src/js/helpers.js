import { TIMEOUT_SEC } from './config.js';

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
