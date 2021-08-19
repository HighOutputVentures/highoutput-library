import _ from 'lodash';
import { HOVHttpClient } from './httpClient';

interface UploadParams {
  apiUrl: string;
  token?: string;
  data: any;
}

export const uploadEmailFiles = async (
  uploadParams: UploadParams
): Promise<any> => {
  const { apiUrl, token, data } = uploadParams;

  const httpClient = HOVHttpClient(token);
  return await httpClient
    .post(apiUrl, data)
    .catch((e: { response: Response }) => {
      return e.response;
    });
};
