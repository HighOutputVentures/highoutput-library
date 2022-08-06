import {
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Textarea,
  TextareaProps,
  useMultiStyleConfig,
} from '@chakra-ui/react';
import React, { forwardRef, ReactNode } from 'react';

import FormContainer, {
  FormContainerProps,
} from '../FormContainer/FormContainer';

export interface TextAreaFieldProps
  extends FormContainerProps,
    Omit<TextareaProps, 'onBlur' | 'id' | 'onChange' | 'size'> {
  type?: string;
  autoFocus?: boolean;
  placeholder: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  limit?: number | undefined;
  isInvalid?: boolean | undefined;
  isDisabled?: boolean;
  variant?: string;
}

const TextAreaField = forwardRef<HTMLTextAreaElement, TextAreaFieldProps>(
  (props, ref) => {
    const {
      isDisabled = false,
      type = 'text',
      autoFocus,
      leftIcon,
      rightIcon,
      onChange,
      onBlur,
      name,
      limit,
      variant = 'primary',
      size,
    } = props;
    const styles = useMultiStyleConfig('Form', { variant, size });

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
            autoFocus={autoFocus}
            ref={ref}
            name={name}
            onChange={onChange}
            onBlur={onBlur}
            sx={styles.formTextarea}
            type={type}
            color="gray.700"
            resize="vertical"
            {...props}
            data-testid="textareafield.input"
          />
          {rightIcon && <InputRightElement>{rightIcon}</InputRightElement>}
        </InputGroup>
      </FormContainer>
    );
  }
);

export default TextAreaField;
