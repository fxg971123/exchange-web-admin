import axios from "axios";
import qs from "qs";
import env from "../../build/env";
//  export const BASEURL = axios.defaults.baseURL = 'http://134.122.174.140/';
export const BASEURL = (axios.defaults.baseURL =
  env === "development"
    ? "http://134.122.174.140/"
    : env === "testing"
    ? "http://134.122.174.140/"
    : "https://api.huidu.xyz/");

export const fetch = (url, params = {}) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        url,
        {
          withCredentials: true,
          params: params,
        },
        { withCredentials: true }
      )
      .then((response) => {
        resolve(response.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const post = (url, data = {}) => {
  return new Promise((resolve, reject) => {
    axios
      .post(
        url,
        qs.stringify(data, { arrayFormat: "repeat" }, { withCredentials: true })
      )
      .then((response) => {
        resolve(response.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const patch = (url, data = {}) => {
  return new Promise((resolve, reject) => {
    axios
      .patch(url, qs.stringify(data, { arrayFormat: "repeat" }))
      .then((response) => {
        resolve(response.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const put = (url, data = {}) => {
  return new Promise((resolve, reject) => {
    axios
      .put(url, qs.stringify(data))
      .then((response) => {
        resolve(response.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const postConfig = (url, data = {}, config) => {
  return new Promise((resolve, reject) => {
    axios
      .post(url, data, config)
      .then((response) => {
        resolve(response.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const postExportConfig = (url, data = {}) => {
  return new Promise((resolve, reject) => {
    axios
      .post(
        url,
        qs.stringify(data, { arrayFormat: "repeat" }, { withCredentials: true }),
        { responseType: "blob" }
      )
      .then((response) => {
        resolve(response.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};


