import { string, object } from 'yup';

export type PostVariables = {
  content?: string;
};

export const postFormSchema = (hasFiles: boolean) => {
  return hasFiles ? object().shape({
    content: string(),
  }) : object().shape({
    content: string().required('Content is required'),
  });
}
