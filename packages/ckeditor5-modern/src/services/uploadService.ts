import _ from 'lodash';
import { HOVHttpClient } from './httpClient';

interface UploadParams {
  apiUrl: string;
  data?: any;
  onLoadProgress?(loadingTotal: number): void;
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

export const uploadFile = (uploadParams: UploadParams): Promise<any> => {
  const { apiUrl, data, onLoadProgress } = uploadParams;

  const httpClient = HOVHttpClient(false);
  return httpClient
    .post(apiUrl, data, {
      onUploadProgress: (progress: ProgressEvent) => {
        const total = (progress.loaded / progress.total) * 100;

        if (onLoadProgress) onLoadProgress(total);
      },
    })
    .catch((e: { response: Response }) => {
      return e.response;
    });
};
