import {
  Box,
  BoxProps,
  Button,
  ButtonProps,
  InputProps,
  TextareaProps,
  VStack,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { FC } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';

import InputField, {
  InputFieldProps,
} from '../../components/InputField/InputField';
import TextAreaField, {
  TextAreaFieldProps,
} from '../../components/TextareaField/TextareaField';

type WithoutChildren<T> = Omit<T, 'children'>;

export type AutoFormProps = {
  yupSchema?: any;
  onSubmitForm?(v: any): void;
  placeholders?: Array<string>;
  partProps?: {
    boxContainer: WithoutChildren<BoxProps>;
    button: WithoutChildren<ButtonProps>;
    textarea: WithoutChildren<TextareaProps>;
    input: WithoutChildren<InputProps>;
  };
};

export enum InputTypeEnum {
  Textarea = 'textarea',
  Input = 'input',
}

export interface InputTypeProps {
  key: string;
  label: string;
  placeholder: string;
  partProps?: {
    textarea: WithoutChildren<TextAreaFieldProps>;
    input: WithoutChildren<InputFieldProps>;
  };
}

const getInputType = (
  input: InputTypeProps,
  type: InputTypeEnum,
  form: UseFormReturn
) => {
  const { key, placeholder, label, partProps } = input;
  const { register, formState } = form;
  const { isSubmitting, errors } = formState;
  const error = (errors[`${key}`]?.message as unknown) as string;

  const input_type = {
    textarea: (
      <TextAreaField
        {...partProps?.textarea}
        {...register(key)}
        key={key}
        id={key}
        label={label}
        placeholder={placeholder}
        errorMsg={error}
        disabled={isSubmitting}
        width="100%"
      />
    ),
    input: (
      <InputField
        {...register(key)}
        key={key}
        id={key}
        label={label}
        placeholder={placeholder}
        errorMsg={error}
        disabled={isSubmitting}
        partProps={{ input: { width: '100%', ...partProps?.input } }}
      />
    ),
  };

  return input_type[type];
};

const AutoForm: FC<AutoFormProps> = props => {
  const { yupSchema, partProps, onSubmitForm, placeholders } = props;

  const dataKey = Object.keys(yupSchema.fields);

  const form = useForm({
    resolver: yupResolver(yupSchema),

    shouldUnregister: true,
  });

  const { handleSubmit } = form;

  const onSubmitData = (s: any) => {
    if (onSubmitForm) onSubmitForm(s);
  };

  return (
    <Box width={512} {...partProps?.boxContainer}>
      <VStack as={'form'} onSubmitCapture={handleSubmit(onSubmitData)}>
        {dataKey.map((key, idx) => {
          const input = {
            key,
            label:
              yupSchema.fields[`${key}`].spec.label ??
              key.charAt(0).toUpperCase() + key.slice(1),
            placeholder: placeholders?.[idx],
            partProps,
          } as InputTypeProps;
          const type = yupSchema.fields[`${key}`].spec?.meta?.type || 'input';

          return getInputType(input, type, form);
        })}
        <Button
          type="submit"
          variant={'primary'}
          width={'100%'}
          {...partProps?.button}
          data-testid="button.form.submit"
        >
          Submit
        </Button>
      </VStack>
    </Box>
  );
};

export default AutoForm;
