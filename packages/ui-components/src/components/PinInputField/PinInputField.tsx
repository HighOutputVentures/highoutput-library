import {
  PinInput,
  PinInputField as ChakraPinInputField,
  PinInputProps,
  HStack,
  Box,
} from '@chakra-ui/react';
import React from 'react';
import { forwardRef } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

interface PinInputFieldProps extends UseFormRegisterReturn {
  numberOfFields?: number;
  chakraPinInputProps?: Omit<PinInputProps, 'children'>;
  errorMsg: string | undefined;
}

const PinInputField = forwardRef<HTMLInputElement, PinInputFieldProps>(
  props => {
    const { numberOfFields = 6, onChange, name, chakraPinInputProps } = props;

    return (
      <Box>
        <HStack spacing={3}>
          <PinInput
            otp
            type={chakraPinInputProps?.type}
            errorBorderColor="red.300"
            isInvalid={Boolean(props?.errorMsg)}
            onChange={value => {
              onChange?.({ target: { value, name } });
            }}
            {...chakraPinInputProps}
          >
            {Array.from({ length: numberOfFields }).map((_, idx) => (
              <ChakraPinInputField
                fontSize="lg"
                fontWeight="semibold"
                borderRadius="4px"
                w="12"
                h="12"
                key={idx}
              />
            ))}
          </PinInput>
        </HStack>
      </Box>
    );
  }
);

PinInputField.displayName = 'PinInputField';

export default PinInputField;