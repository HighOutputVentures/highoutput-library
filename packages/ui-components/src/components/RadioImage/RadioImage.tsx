import {
  Box,
  chakra,
  HTMLChakraProps,
  Image,
  ThemingProps,
  useRadio,
  useStyleConfig,
} from '@chakra-ui/react';
import React, { forwardRef } from 'react';

export interface RadioImageProps extends HTMLChakraProps<'div'>, ThemingProps {
  image: string;
  selectColor?: string;
  value?: string;
}

const RadioImage = forwardRef<HTMLDivElement, RadioImageProps>((props, ref) => {
  const { image, size, variant, selectColor, ...rest } = props;
  const styles = useStyleConfig('RadioImage', { size, variant });

  const {
    state,
    getInputProps,
    getCheckboxProps,
    htmlProps,
    getLabelProps,
  } = useRadio(rest);

  return (
    <chakra.label {...htmlProps} cursor="pointer">
      <input {...getInputProps({})} hidden data-testid="radio.image.input" />
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
        data-testid="radio.image.box"
      >
        <Image
          src={image}
          rounded="full"
          {...getLabelProps()}
          data-testid="radio.image.container"
        />
      </Box>
    </chakra.label>
  );
});

export default RadioImage;
