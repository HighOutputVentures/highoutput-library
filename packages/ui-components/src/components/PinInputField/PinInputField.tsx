import {
  HStack,
  PinInput,
  PinInputField as Pin,
  PinInputFieldProps as PinProps,
  PinInputProps,
  useStyleConfig,
} from '@chakra-ui/react';
import React, { forwardRef, useMemo } from 'react';
import { ChangeHandler } from 'react-hook-form';

import FormContainer, {
  FormContainerProps,
} from '../FormContainer/FormContainer';

type WithoutChildren<T> = Omit<T, 'children'>;

export interface PinInputFieldProps
  extends Omit<
      FormContainerProps,
      'onChange' | 'partProps' | 'size' | 'variant'
    >,
    Omit<PinInputProps, 'onChange' | 'children' | 'id'> {
  numberOfFields?: number;
  onChange: ChangeHandler;
  errorMsg?: string | undefined;
  partProps?: Partial<{
    pin: WithoutChildren<PinProps>;
  }>;
}

const PinInputField = forwardRef<HTMLInputElement, PinInputFieldProps>(
  (props, _) => {
    const {
      numberOfFields = 6,
      onChange,
      size,
      variant,
      partProps,
      name,
      type = 'alphanumeric',
      onComplete,
    } = props;
    const styles = useStyleConfig('PinInputField', { size, variant });
    const fieldsArray = useMemo(() => Array.from({ length: numberOfFields }), [
      numberOfFields,
    ]);

    return (
      <FormContainer {...props}>
        <HStack spacing={3}>
          <PinInput
            autoFocus
            otp
            focusBorderColor="primary.500"
            errorBorderColor="red.300"
            isInvalid={Boolean(props?.errorMsg)}
            type={type}
            {...props}
            onChange={value => {
              onChange?.({ target: { value, name } });
            }}
            onComplete={onComplete}
            data-testid="pininput.input"
          >
            {fieldsArray.map((_, idx) => (
              <Pin
                fontSize="lg"
                fontWeight="semibold"
                borderRadius="4px"
                w="12"
                h="12"
                key={idx}
                sx={styles}
                {...partProps?.pin}
                data-testid="pininput.pin"
              />
            ))}
          </PinInput>
        </HStack>
      </FormContainer>
    );
  }
);

PinInputField.displayName = 'PinInputField';

export default PinInputField;
