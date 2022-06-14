import React, { FC } from 'react';
import { RadioProps, useRadio, chakra, Box, Image } from '@chakra-ui/react';

export interface HovRadioImage extends RadioProps {
  image: string;
  selectColor?: string;
}

const HovRadioImage: FC<HovRadioImage> = props => {
  const { image, selectColor = 'green.200', w = 12, ...radioProps } = props;
  const {
    state,
    getInputProps,
    getCheckboxProps,
    htmlProps,
    getLabelProps,
  } = useRadio(radioProps);

  return (
    <chakra.label {...htmlProps} cursor="pointer">
      <input {...getInputProps({})} hidden data-testid="radio.image.input" />
      <Box
        {...getCheckboxProps()}
        bg={state.isChecked ? selectColor : 'transparent'}
        w={w}
        p={1}
        rounded="full"
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
};

export default HovRadioImage;
