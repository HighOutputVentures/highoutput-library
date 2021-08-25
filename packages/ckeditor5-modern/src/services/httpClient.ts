import axios from 'axios';
import { getAccessToken } from '../utils/tokenStorage';

const commonHeaders = {
  Accept: 'application/json, application/xml, text/play, text/html, *.*',
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
};
axios.defaults.headers.common = commonHeaders;

export const hovHttpClient = (allowToken: boolean = true) => {
  const hovHttpClient = axios.create();
  hovHttpClient.interceptors.request.use(
    config => {
      if (getAccessToken() && allowToken) {
        config.headers.Authorization = `Bearer ${getAccessToken()}`;
      }
      return config;
    },
    error => Promise.reject(error)
  );
  return hovHttpClient;
};

export const handleUnauthorizedError = () => {
  hovHttpClient().interceptors.response.use(
    response => response,
    error => {
      return Promise.reject(error);
    }
  );
};

export default axios;
