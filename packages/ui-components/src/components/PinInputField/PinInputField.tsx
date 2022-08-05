import {
  HStack,
  PinInput,
  PinInputField as Pin,
  PinInputFieldProps as PinProps,
  PinInputProps,
  useStyleConfig,
} from '@chakra-ui/react';
import React, { forwardRef } from 'react';
import { ChangeHandler, UseFormRegisterReturn } from 'react-hook-form';

import FormContainer from '../FormContainer/FormContainer';

type WithoutChildren<T> = Omit<T, 'children'>;

export interface PinInputFieldProps
  extends Omit<UseFormRegisterReturn, 'onChange'>,
    Omit<PinInputProps, 'onChange' | 'children'> {
  numberOfFields?: number;
  onChange: ChangeHandler;
  errorMsg?: string | undefined;
  partProps?: Partial<{
    pin: WithoutChildren<PinProps>;
  }>;
}

const PinInputField = forwardRef<HTMLInputElement, PinInputFieldProps>(
  (props, _) => {
    const { numberOfFields = 6, onChange, name, size, variant } = props;
    const styles = useStyleConfig('Pin', { size, variant });

    return (
      <FormContainer id="pininput.container" errorMsg={props.errorMsg}>
        <HStack spacing={3}>
          <PinInput
            otp
            errorBorderColor="red.300"
            isInvalid={Boolean(props?.errorMsg)}
            {...props}
            onChange={value => {
              onChange?.({ target: { value, name } });
            }}
            data-testid="pininput.input"
          >
            {Array.from({ length: numberOfFields }).map((_, idx) => (
              <Pin
                fontSize="lg"
                fontWeight="semibold"
                borderRadius="4px"
                w="12"
                h="12"
                key={idx}
                sx={styles}
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
