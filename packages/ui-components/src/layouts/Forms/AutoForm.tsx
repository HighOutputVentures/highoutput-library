import {
  Box,
  BoxProps,
  Button,
  ButtonProps,
  Input,
  InputProps,
  Textarea,
  TextareaProps,
  VStack,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';
import FormContainer from '../../components/FormContainer/FormContainer';
import { useForm } from 'react-hook-form';
import ReactTextareaAutosize from 'react-textarea-autosize';

export type AutoFormProps = {
  yupSchema?: any;
  inputProps?: InputProps;
  onSubmitForm?(v: any): void;
  buttonProps?: ButtonProps;
  boxContainer?: BoxProps;
  placeholders?: Array<string>;
  textAreaProps?: TextareaProps;
};

const AutoForm = (props: AutoFormProps) => {
  const {
    yupSchema,
    buttonProps,
    boxContainer,
    onSubmitForm,
    placeholders,
    inputProps,
    textAreaProps,
  } = props;

  const dataKey = Object.keys(yupSchema.fields);

  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(yupSchema),

    shouldUnregister: true,
  });

  const onSubmitData = (s: any) => {
    if (onSubmitForm) onSubmitForm(s);
  };
  return (
    <Box width={512} {...boxContainer}>
      <VStack as={'form'} onSubmitCapture={handleSubmit(onSubmitData)}>
        {dataKey.map((key, idx) => {
          const error = formState.errors[`${key}`]?.message;
          return (
            <FormContainer
              id={key}
              key={key}
              required={yupSchema.fields[`${key}`].exclusiveTests.required}
              label={
                yupSchema.fields[`${key}`].spec.label ??
                key.charAt(0).toUpperCase() + key.slice(1)
              }
              errorMsg={(error as unknown) as string}
            >
              {yupSchema.fields[`${key}`].spec?.meta?.type === 'textarea' ? (
                <Textarea
                  as={ReactTextareaAutosize}
                  {...register(`${key}`)}
                  placeholder={placeholders?.[idx]}
                  data-testid="form.input.container"
                  errorBorderColor={'red.500'}
                  _focus={{ border: 'none' }}
                  _active={{ border: 'none' }}
                  isReadOnly={formState.isSubmitting}
                  {...textAreaProps}
                />
              ) : (
                <Input
                  id={key}
                  placeholder={placeholders?.[idx]}
                  {...register(`${key}`)}
                  width={'100%'}
                  data-testid="form.input.container"
                  borderRadius={'8px'}
                  border={'1px solid rgba(128,128,128,0.3)'}
                  padding={'0.5rem'}
                  errorBorderColor={'red.500'}
                  _active={{ border: 'none' }}
                  {...inputProps}
                  isReadOnly={formState.isSubmitting}
                />
              )}
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
