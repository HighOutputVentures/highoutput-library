import _ from 'lodash';
import { hovHttpClient } from './httpClient';

export interface UploadParams {
  apiUrl: string;
  file?: File;
  data?: any;
  onLoadProgress?(loadingTotal: number): void;
}

interface UploadPolicy extends UploadParams {
  type: string;
  filename: string;
}

export const getUploadCrendentials = async (
  uploadParams: UploadPolicy
): Promise<any> => {
  const { apiUrl, type, filename, file } = uploadParams;

  const httpClient = hovHttpClient();
  return await httpClient
    .post(apiUrl, { type: type, filename: filename })
    .then(res => ({ ...res, file }))
    .catch((e: { response: Response }) => {
      return e.response;
    });
};

export const uploadFile = (uploadParams: UploadParams): Promise<any> => {
  const { apiUrl, data, onLoadProgress } = uploadParams;

  const httpClient = hovHttpClient(false);
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
