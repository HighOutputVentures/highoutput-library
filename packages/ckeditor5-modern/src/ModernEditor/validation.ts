import { string, object, SchemaOf, InferType } from 'yup';

type PostVariables = {
  content: string;
};

export const postFormSchema: SchemaOf<PostVariables> = object().shape({
  content: string().required('Content is required'),
});

export type PostFormSchemaValues = InferType<typeof postFormSchema>;
