import React, { FC } from 'react';
import { RadioProps, useRadio, chakra, Box, Image } from '@chakra-ui/react';

export interface HovRadioImage extends RadioProps {
  image: string;
}

const HovRadioImage: FC<HovRadioImage> = props => {
  const { image, ...radioProps } = props;
  const {
    state,
    getInputProps,
    getCheckboxProps,
    htmlProps,
    getLabelProps,
  } = useRadio(radioProps);

  return (
    <chakra.label {...htmlProps} cursor="pointer">
      <input {...getInputProps({})} hidden />
      <Box
        {...getCheckboxProps()}
        bg={state.isChecked ? 'green.200' : 'transparent'}
        w={12}
        p={1}
        rounded="full"
      >
        <Image src={image} rounded="full" {...getLabelProps()} />
      </Box>
    </chakra.label>
  );
};

export default HovRadioImage;
