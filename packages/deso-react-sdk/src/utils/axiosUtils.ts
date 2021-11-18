import axios, { Method } from 'axios';

export const getAxiosInstance = (
  endpoint: string,
  data: any,
  method: Method = 'get',
  accessToken?: string
) => {
  const derivedToken = accessToken;
  return axios({
    method,
    url: endpoint,
    data,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Accept-Encoding': 'gzip',
      ...(derivedToken && { authorization: `Bearer ${derivedToken}` }),
    },
  });
};
