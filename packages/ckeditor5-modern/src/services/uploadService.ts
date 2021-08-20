import _ from 'lodash';
import { HOVHttpClient } from './httpClient';

interface UploadParams {
  apiUrl: string;
  data?: any;
}

interface UploadPolicy extends UploadParams {
  type: string;
  filename: string;
}

export const uploadGetCrendentials = async (
  uploadParams: UploadPolicy
): Promise<any> => {
  const { apiUrl, type, filename } = uploadParams;

  const httpClient = HOVHttpClient();
  return await httpClient
    .post(apiUrl, { type: type, filename: filename })
    .then(({ data }) => data)
    .catch((e: { response: Response }) => {
      return e.response;
    });
};

export const uploadFile = async (uploadParams: UploadParams): Promise<any> => {
  const { apiUrl, data } = uploadParams;

  const httpClient = HOVHttpClient(false);
  return await httpClient
    .post(apiUrl, data)
    .catch((e: { response: Response }) => {
      return e.response;
    });
};
