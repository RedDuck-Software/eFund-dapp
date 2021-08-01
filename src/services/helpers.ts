import { SERVER_API_URL } from "../constants";

import axios from "axios";

export const getBnbPriceInUSTD = timeStampFrom => getPriceInUSDT(timeStampFrom, "BNB");

export const getEthPriceInUSTD = timeStampFrom => getPriceInUSDT(timeStampFrom, "ETH");

// shows how originalValue different from newValue in %
export const getPercentageDiff = (originalValue, newValue) => {
  const diff = newValue - originalValue;
  return (diff / originalValue) * 100;
};

export const updateUserProfileInfo = async (image, username, description) => { };

export const getUserByAddress = async (address, chainId) => {
  try {
    const res = await sendGetRequestToServer(`/api/user/${address}`, {
      headers: {
        ChainId: chainId,
      },
    });

    if (res != "" && res != null && res) {
      res.imageUrl = SERVER_API_URL + `/image/${res.imageUrl == null ? "default.jpeg" : res.imageUrl}`;
    }

    return res;
  } catch (error) {
    console.log(error);

    return null;
  }
};

export const getFundInfoByAddress = async (address, chainId) => {
  try {
    const res = await sendGetRequestToServer(`/api/hedgeFundInfo/${address}`, {
      headers: {
        ChainId: chainId,
      },
    });

    console.log(res.imageUrl);

    if (res != "" && res != null && res) {
      res.imageUrl = SERVER_API_URL + `/image/${res.imageUrl == null ? "default.jpeg" : res.imageUrl}`;
    }

    return res;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const updateUser = async (data, image, chainId) => {
  const formData = new FormData();
  formData.append("image", image);

  console.log("form data: ", formData);
  console.log("image", image);

  return await sendPostRequestToServer(
    `/api/user/updateUserInfo?address=${data.address}&signedNonce=${data.signedNonce}` +
    (data.username == null ? "" : `&username=${data.username}`) +
    (data.description == null ? "" : `&description=${data.description}`),
    formData,
    {
      headers: {
        ChainId: chainId,
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

export const createFundInfo = async (data, image, chainId) => {
  const formData = new FormData();
  formData.append("image", image);

  return await sendPostRequestToServer(
    `/api/hedgeFundInfo/createFundInfo?contractAddress=${data.contractAddress}` +
    (data.name == null ? "" : `&name=${data.name}`) +
    (data.description == null ? "" : `&description=${data.description}`),
    formData,
    {
      headers: {
        ChainId: chainId,
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

export const registerUser = async (data, image, chainId) => {
  const formData = new FormData();
  formData.append("image", image);

  return await sendPostRequestToServer(
    ((`/api/user/register?address=${data.address}&signedNonce=${data.signedNonce}`) +
      (data.username == null ? "" : `&username=${data.username}`) +
      (data.description == null ? "" : `&description=${data.description}`)),

    formData,
    {
      headers: {
        ChainId: chainId,
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

export const getGenericSignNonce = async () => {
  return await sendGetRequestToServer("/api/user/getGenericSignNonce", undefined);
};

const sendGetRequestToServer = async (endpoint, settings) => {
  const resp = await axios.get(SERVER_API_URL + endpoint, settings);

  return resp.data;
};

const sendPostRequestToServer = async (endpoint, data, settings) => {
  const resp = await axios.post(SERVER_API_URL + endpoint, data, settings);

  return resp.data;
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

  return {
    value:
      eZ(r.year, " years ") +
      eZ(r.month, " months ") +
      eZ(r.day, " days ") +
      eZ(r.hour, " hours ") +
      eZ(r.minute, " minutes ") +
      eZ(r.second, " seconds "),
    obj: r,
  };
};
