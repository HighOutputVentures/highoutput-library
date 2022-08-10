import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { InputProps, Button } from '@chakra-ui/react';
import React, { forwardRef } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';
import InputField from '../InputField/InputField';

export interface PasswordInputProps extends UseFormRegisterReturn {
  chakraInputProps?: Omit<InputProps, 'children'>;
  placeholder: string;
  errorMsg?: string;
  onPressEnter?: () => void;
}

const PasswordInputField = forwardRef<HTMLInputElement, PasswordInputProps>(
  (props, _) => {
    const {
      chakraInputProps,
      placeholder,
      onBlur,
      errorMsg,
      onChange,
      onPressEnter,
    } = props;
    const [showPassword, setShowPassword] = React.useState(false);
    const onClickRightIcon = () => setShowPassword(prev => !prev);

    return (
      <InputField
        placeholder={placeholder}
        id="Password-input"
        partProps={{
          input: {
            'aria-label': 'password-input',
            ...chakraInputProps,
          },
        }}
        type={showPassword ? 'text' : 'password'}
        errorMsg={errorMsg}
        onBlur={onBlur}
        onChange={onChange}
        onPressEnter={onPressEnter}
        rightIcon={
          <Button
            background={'none'}
            _hover={{ background: 'none' }}
            _active={{ background: 'none' }}
            aria-label={'show-hide-btn'}
            onClick={onClickRightIcon}
          >
            {showPassword ? <ViewIcon /> : <ViewOffIcon />}
          </Button>
        }
      />
    );
  }
);

PasswordInputField.displayName = 'PasswordInputField';

export default PasswordInputField;
