import {
  CSSObject,
  Input,
  InputGroup,
  InputLeftElement,
  InputProps,
  InputRightElement,
  ThemeTypings,
  useMultiStyleConfig,
} from '@chakra-ui/react';
import React, { forwardRef, ReactNode } from 'react';

import FormContainer, {
  FormContainerProps,
} from '../FormContainer/FormContainer';

export interface InputFieldProps extends FormContainerProps {
  size?: ThemeTypings['sizes'];
  type?: string;
  maxLength?: number;
  autoFocus?: boolean;
  placeholder: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  autoComplete?: string;
  disabled?: boolean;
  readOnly?: boolean;
  defaultValue?: string;
  inputChakraProps?: InputProps;
  inputGroupChakraProps?: InputProps;
  variant?: string;
  _hover?: CSSObject;
  onPressEnter?(): void;
  hasLeftPointerEvents?: boolean;
  inputValue?: string | undefined;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  (props, ref) => {
    const {
      type = 'text',
      size = 'md',
      maxLength,
      autoFocus,
      placeholder,
      leftIcon,
      rightIcon,
      onChange,
      onBlur,
      name,
      autoComplete,
      disabled,
      readOnly,
      defaultValue,
      inputChakraProps,
      variant = 'primary',
      onPressEnter,
      hasLeftPointerEvents,
      inputValue,
    } = props;
    const styles = useMultiStyleConfig('Form', { variant });

    return (
      <FormContainer {...props}>
        <InputGroup size={size}>
          {leftIcon && (
            <InputLeftElement
              pointerEvents={hasLeftPointerEvents ? 'all' : 'none'}
            >
              {leftIcon}
            </InputLeftElement>
          )}
          <Input
            {...inputChakraProps}
            errorBorderColor="red.500"
            autoFocus={autoFocus}
            ref={ref}
            name={name}
            onChange={onChange}
            onBlur={onBlur}
            sx={styles.formInput}
            type={type}
            placeholder={placeholder}
            autoComplete={autoComplete}
            disabled={disabled}
            readOnly={readOnly}
            defaultValue={defaultValue}
            maxLength={maxLength}
            variant="check-in"
            onKeyPress={(e: { key: string }) => {
              if (e.key === 'Enter') {
                if (onPressEnter) onPressEnter();
              }
            }}
            value={inputValue ? inputValue.trim() : undefined}
          />
          {rightIcon && <InputRightElement>{rightIcon}</InputRightElement>}
        </InputGroup>
      </FormContainer>
    );
  }
);

export default InputField;
