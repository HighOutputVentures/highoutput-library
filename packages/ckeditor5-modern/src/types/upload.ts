export type TParams = {
  acl: string;
  key: string;
  policy: string;
  success_action_status: string;
  'x-amz-algorithm': string;
  'x-amz-credential': string;
  'x-amz-date': string;
  'x-amz-signature': string;
};

export interface IUploadResult {
  origin: string;
  params: TParams;
  url: string;
}

export interface IUploadMapResult {
  data: IUploadResult;
  file: File;
}
