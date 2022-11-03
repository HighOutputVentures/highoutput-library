import {
  HStack,
  PinInput,
  PinInputField as Pin,
  PinInputFieldProps as PinProps,
  PinInputProps,
  useStyleConfig,
  Box,
} from '@chakra-ui/react';
import React, { forwardRef, useId, useMemo } from 'react';
import { ChangeHandler } from 'react-hook-form';

import FormContainer, {
  FormContainerPartProps,
  FormContainerProps,
} from '../FormContainer/FormContainer';

type WithoutChildren<T> = Omit<T, 'children'>;
export interface PinInputFieldPartProps extends FormContainerPartProps {
  pin?: WithoutChildren<PinProps>;
}
export interface PinInputFieldProps
  extends Omit<
      FormContainerProps,
      'onChange' | 'partProps' | 'size' | 'variant'
    >,
    Omit<PinInputProps, 'onChange' | 'children' | 'id'> {
  numberOfFields?: number;
  onChange: ChangeHandler;
  errorMsg?: string | undefined;

  partProps?: Partial<PinInputFieldPartProps>;
}

const PinInputField = forwardRef<HTMLInputElement, PinInputFieldProps>(
  (props, _) => {
    const {
      numberOfFields = 3,
      onChange,
      size,
      variant = 'outline',
      partProps,
      name,
      type = 'alphanumeric',
      onComplete,
      disabled,
    } = props;
    const styles = useStyleConfig('PinInputField', { size, variant });

    const fieldsArray = useMemo(() => {
      return numberOfFields <= 6
        ? Array.from({ length: numberOfFields })
        : Array.from({ length: 3 });
    }, [numberOfFields]);

    const uid = useId();

    return (
      <FormContainer {...props}>
        <HStack spacing={3}>
          <PinInput
            autoFocus
            otp
            focusBorderColor="brand.primary.700"
            errorBorderColor="red.300"
            isInvalid={Boolean(props?.errorMsg)}
            type={type}
            isDisabled={disabled}
            variant={variant}
            {...props}
            placeholder="0"
            onChange={value => {
              onChange?.({ target: { value, name } });
            }}
            onComplete={onComplete}
            data-testid={`${uid}-pininput-input`}
          >
            {fieldsArray.map((_, idx) => {
              return (
                <React.Fragment key={idx}>
                  {fieldsArray.length === 6 && idx === 3 && (
                    <Box
                      fontSize="60px"
                      fontWeight="500"
                      color="#D0D5DD"
                      height="64px"
                      textAlign="center"
                      display="flex"
                      alignItems="center"
                      pb="10px"
                    >
                      -
                    </Box>
                  )}
                  <Pin
                    fontWeight="semibold"
                    w="12"
                    h="12"
                    key={idx}
                    sx={styles}
                    {...partProps?.pin}
                    data-testid={`${uid}-pininput-pin-${idx}`}
                  />
                </React.Fragment>
              );
            })}
          </PinInput>
        </HStack>
      </FormContainer>
    );
  }
);

PinInputField.displayName = 'PinInputField';

export default PinInputField;
