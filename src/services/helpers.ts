export const getBnbPriceInUSTD = timeStampFrom => getPriceInUSDT(timeStampFrom, "BNB");

export const getEthPriceInUSTD = timeStampFrom => getPriceInUSDT(timeStampFrom, "ETH");

// shows how originalValue different from newValue in %
export const getPercentageDiff = (originalValue, newValue) => {
  const diff = newValue - originalValue;
  return (diff / originalValue) * 100;
};

const getPriceInUSDT = (timeStampFrom, currency) => {
  const url = `https://api.binance.com/api/v3/klines?symbol=${currency}USDT&startTime=${timeStampFrom *
    1000}&interval=1m&limit=1`;

  console.log(url);

  return parseFloat(JSON.parse(httpGet(url))[0][1]);
};

function httpGet(theUrl) {
  const xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", theUrl, false); // false for synchronous request
  xmlHttp.send(null);
  return xmlHttp.responseText;
}


export const groupArrayBy = function (xs, key) {
  return xs.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

export const oneDayDurationInSeconds = 86_400;

export const formatDuration = durInSeconds => {
  const r = {
    year: 0,
    month: 0,
    week: 0,
    day: 0,
    hour: 0,
    minute: 0,
    second: 0,
  };

  const s = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1,
  };

  Object.keys(s).forEach(function (key) {
    r[key] = Math.floor(durInSeconds / s[key]);
    durInSeconds -= r[key] * s[key];
  });

  const emptyStringIfZeroVal = function (val, mod) {
    return val == 0 ? "" : val.toString() + mod;
  };

  const eZ = emptyStringIfZeroVal;

  return ({
    value: (eZ(r.year, " years ") +
      eZ(r.month, " months ") +
      eZ(r.day, " days ") +
      eZ(r.hour, " hours ") +
      eZ(r.minute, " minutes ") +
      eZ(r.second, " seconds ")),
    obj: r,
  }

  );
};
