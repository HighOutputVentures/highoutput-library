import axios from 'axios';

const commonHeaders = {
  Accept: 'application/json, application/xml, text/play, text/html, *.*',
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
};
axios.defaults.headers.common = commonHeaders;

export const HOVHttpClient = (token?: string) => {
  const hovHttpClient = axios.create();
  hovHttpClient.interceptors.request.use(
    config => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    error => Promise.reject(error)
  );
  return hovHttpClient;
};

export const handleUnauthorizedError = () => {
  HOVHttpClient().interceptors.response.use(
    response => response,
    error => {
      return Promise.reject(error);
    }
  );
};

export default axios;
