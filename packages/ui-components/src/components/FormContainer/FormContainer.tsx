import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  useMultiStyleConfig,
} from '@chakra-ui/react';
import React, { FC, ReactNode } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

export interface FormContainerProps extends Partial<UseFormRegisterReturn> {
  id: string;
  label?: string;
  labelColor?: string;
  errorMsg?: string;
  helperMsg?: string;
  disabled?: boolean;
  children?: ReactNode;
}

const FormContainer: FC<FormContainerProps> = ({
  id,
  label,
  labelColor,
  errorMsg,
  helperMsg,
  children,
  disabled,
}) => {
  const styles = useMultiStyleConfig('Form', {});
  return (
    <FormControl
      sx={styles.formControl}
      id={id}
      isInvalid={Boolean(errorMsg)}
      isReadOnly={disabled}
      data-testid="formcontainer.formcontrol"
    >
      {label && (
        <FormLabel
          borderRadius="4px"
          {...(labelColor && { color: labelColor })}
          sx={styles.formLabel}
        >
          {label}
        </FormLabel>
      )}
      {children}
      <FormErrorMessage
        sx={styles.formErrorMessage}
        data-testid="formcontainer.error"
      >
        {errorMsg}
      </FormErrorMessage>
      {helperMsg && (
        <FormHelperText sx={styles.formHelperText}>{helperMsg}</FormHelperText>
      )}
    </FormControl>
  );
};

export default FormContainer;
