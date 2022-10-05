import {
  Box,
  chakra,
  HTMLChakraProps,
  Image,
  StyleProps,
  ThemingProps,
  useRadio,
  useStyleConfig,
} from '@chakra-ui/react';
import { StringOrNumber } from '@chakra-ui/utils';
import React, { forwardRef, useId } from 'react';

export type EventOrValue = React.ChangeEvent<HTMLInputElement> | StringOrNumber;

export interface RadioImageProps
  extends ThemingProps,
    StyleProps,
    Omit<HTMLChakraProps<'div'>, 'onChange' | 'value'> {
  image: string;
  selectColor?: string;
  onChange?: (e: EventOrValue) => void;
  value?: string | number;
  checked?: boolean;
  isChecked?: boolean;
}

const RadioImage = forwardRef<HTMLDivElement, RadioImageProps>((props, ref) => {
  const { image, size, variant, selectColor, ...rest } = props;
  const styles = useStyleConfig('RadioImage', { size, variant });
  const uid = useId();

  const {
    state,
    getInputProps,
    getCheckboxProps,
    htmlProps,
    getLabelProps,
  } = useRadio(rest);

  return (
    <chakra.label {...htmlProps} cursor="pointer">
      <chakra.input
        {...getInputProps({})}
        hidden
        data-testid={`${uid}-radio-image-input`}
      />
      <Box
        ref={ref}
        w={12}
        p={1}
        sx={styles}
        {...getCheckboxProps()}
        rounded="full"
        bg={
          state.isChecked
            ? selectColor || (styles.color as string) || 'green.500'
            : 'transparent'
        }
        data-testid={`${uid}-radio-image-box`}
      >
        <Image
          src={image}
          rounded="full"
          {...getLabelProps()}
          data-testid={`${uid}-radio-image-container`}
        />
      </Box>
    </chakra.label>
  );
});

export default RadioImage;
