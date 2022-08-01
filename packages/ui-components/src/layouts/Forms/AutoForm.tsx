import {
  Box,
  BoxProps,
  Button,
  ButtonProps,
  InputProps,
  VStack,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';
import FormContainer from '../../components/FormContainer/FormContainer';
import { useForm } from 'react-hook-form';
export type AutoFormSchema = {
  yupSchema: any;
  inputProps?: InputProps;
  onSubmitForm?(v: any): void;
  buttonProps?: ButtonProps;
  boxContainer?: BoxProps;
  placeholders?: Array<string>;
};

const AutoForm = (props: AutoFormSchema) => {
  const {
    yupSchema,
    buttonProps,
    boxContainer,
    onSubmitForm,
    placeholders,
    inputProps,
  } = props;

  const dataKey = Object.keys(yupSchema.fields);

  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(yupSchema),

    shouldUnregister: true,
  });

  const onSubmitData = (s: any) => {
    if (onSubmitForm) onSubmitForm(s);
  };
  console.log(typeof yupSchema);
  return (
    <Box width={512} {...boxContainer}>
      <VStack as={'form'} onSubmitCapture={handleSubmit(onSubmitData)}>
        {dataKey.map((key, idx) => {
          const error = formState.errors[`${key}`]?.message;
          return (
            <FormContainer
              id={key}
              label={
                yupSchema.fields[`${key}`].spec.label ??
                key.charAt(0).toUpperCase() + key.slice(1)
              }
              errorMsg={(error as unknown) as string}
            >
              <Box
                id={key}
                as={yupSchema.fields[`${key}`].spec?.meta?.type ?? 'input'}
                placeholder={placeholders?.[idx]}
                {...register(`${key}`)}
                p={1}
                width={'100%'}
                data-testid="form.input.container"
                {...inputProps}
              />
            </FormContainer>
          );
        })}
        <Button
          type="submit"
          variant={'primary'}
          width={'100%'}
          {...buttonProps}
          data-testid="button.form.submit"
        >
          Sumbit
        </Button>
      </VStack>
    </Box>
  );
};

export default AutoForm;
