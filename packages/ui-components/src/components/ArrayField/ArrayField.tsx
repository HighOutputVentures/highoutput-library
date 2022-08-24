import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import {
  Button,
  Flex,
  Icon,
  Text,
  InputElementProps,
  InputGroupProps,
  InputProps,
  VStack,
  ButtonProps,
  TextProps,
  IconProps,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { ReactNode } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import InputField from '../InputField/InputField';
import { ArrayFieldSchema, ArrayFieldTypeValues } from './validation';

type WithoutChildren<T> = Omit<T, 'children'>;
export interface ArrayFieldProps {
  partProps?: {
    input: WithoutChildren<InputProps>;
    labelProps: WithoutChildren<TextProps>;
    inputGroup: WithoutChildren<InputGroupProps>;
    inputLeftElement: WithoutChildren<InputElementProps>;
    inputRightElement: WithoutChildren<InputElementProps>;
    buttonRemoveProps: {
      buttonProps: WithoutChildren<ButtonProps>;
      iconProps: WithoutChildren<IconProps>;
    };
    buttonAddProps: {
      buttonProps: WithoutChildren<ButtonProps>;
      iconProps: WithoutChildren<IconProps>;
    };
  };
  buttonRemoveChildren?: ReactNode;
  buttonAddChildren?: ReactNode;
  defaultValues: {
    input: ArrayFieldTypeValues[];
  };
  onChange: (data: Record<string, any>) => void;
  onRemove: (data: Record<string, any>) => void;
  onAppend: (data: Record<string, any>) => void;
  onBlur: (data: Record<string, any>) => void;
  maxValue?: number;
  label?: string;
  placeholder?: string;
  isRequired?: boolean;
}

const ArrayField = (props: ArrayFieldProps) => {
  const {
    placeholder,
    defaultValues,
    partProps,
    onChange,
    onRemove,
    onBlur,
    onAppend,
    label,
    isRequired,
    buttonAddChildren,
    buttonRemoveChildren,
    maxValue,
  } = props;
  const { control, register, handleSubmit, formState } = useForm<{
    input: ArrayFieldTypeValues[];
  }>({
    defaultValues,
    resolver: isRequired ? yupResolver(ArrayFieldSchema) : undefined,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'input',
  });

  const handleAddField = handleSubmit(async data => {
    if (maxValue && fields.length <= maxValue - 1) {
      append({
        value: '',
      });
      onAppend(data);
    }
  });

  const handleOnBlurInput = handleSubmit(async data => {
    onBlur(data);
  });

  const handleRemove = handleSubmit(async data => {
    onRemove(data);
  });

  const handleOnChangeInput = handleSubmit(async data => {
    onChange(data);
  });

  return (
    <Flex flexDir="column" gap={2}>
      {label && <Text {...partProps?.labelProps}>{label}</Text>}
      {fields.map((item, idx) => (
        <Flex
          gap={2}
          key={item.id}
          onBlur={handleOnBlurInput}
          onChange={handleOnChangeInput}
        >
          <InputField
            id={'input'}
            placeholder={placeholder ?? ''}
            {...register(`input.${idx}.value`)}
            partProps={partProps}
            errorMsg={
              isRequired ? formState.errors?.input?.[idx]?.value?.message : ''
            }
          />
          <VStack>
            <Button
              variant="outline"
              onClick={() => {
                remove(idx);
                handleRemove();
              }}
              disabled={fields.length <= 1}
              width="32px"
              height="40px"
              {...partProps?.buttonRemoveProps?.buttonProps}
            >
              {buttonRemoveChildren ? (
                buttonRemoveChildren
              ) : (
                <Icon
                  {...partProps?.buttonRemoveProps?.iconProps}
                  as={DeleteIcon}
                />
              )}
            </Button>
            {idx === fields.length - 1 && (
              <Button
                variant="outline"
                width="32px"
                height="40px"
                disabled={maxValue === fields.length}
                onClick={handleAddField}
                {...partProps?.buttonAddProps?.buttonProps}
              >
                {buttonAddChildren ? (
                  buttonAddChildren
                ) : (
                  <Icon
                    {...partProps?.buttonAddProps?.iconProps}
                    as={AddIcon}
                  />
                )}
              </Button>
            )}
          </VStack>
        </Flex>
      ))}
    </Flex>
  );
};

export default ArrayField;
