import {
  InputGroup,
  InputLeftElement,
  InputRightElement,
  StyleProps,
  Textarea,
  TextareaProps,
  useMultiStyleConfig,
} from '@chakra-ui/react';
import React, { forwardRef, ReactNode } from 'react';

import FormContainer, {
  FormContainerProps,
} from '../FormContainer/FormContainer';

export interface TextAreaFieldProps extends FormContainerProps {
  type?: string;
  autoFocus?: boolean;
  placeholder: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  styleProps?: StyleProps;
  limit?: number | undefined;
  isInvalid?: boolean | undefined;
  isDisabled?: boolean;
  textAreaProps?: TextareaProps;
  variant?: string;
}

const TextAreaField = forwardRef<HTMLTextAreaElement, TextAreaFieldProps>(
  (props, ref) => {
    const {
      isDisabled = false,
      type = 'text',
      autoFocus,
      placeholder,
      leftIcon,
      rightIcon,
      onChange,
      onBlur,
      name,
      limit,
      styleProps,
      isInvalid,
      textAreaProps,
      variant = 'primary',
    } = props;
    const styles = useMultiStyleConfig('Form', { variant });

    return (
      <FormContainer {...props}>
        <InputGroup>
          {leftIcon && (
            <InputLeftElement pointerEvents="none">{leftIcon}</InputLeftElement>
          )}
          <Textarea
            isDisabled={isDisabled}
            maxLength={limit}
            errorBorderColor="red.500"
            isInvalid={isInvalid}
            autoFocus={autoFocus}
            ref={ref}
            name={name}
            onChange={onChange}
            onBlur={onBlur}
            sx={styles.formTextarea}
            type={type}
            placeholder={placeholder}
            color="gray.700"
            resize="vertical"
            {...textAreaProps}
            {...styleProps}
          />
          {rightIcon && <InputRightElement>{rightIcon}</InputRightElement>}
        </InputGroup>
      </FormContainer>
    );
  }
);

export default TextAreaField;
