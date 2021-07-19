import React, { FC } from 'react';
import { CloseButton, Image, AspectRatio, Box } from '@chakra-ui/react';

interface ImagePreviewProps {
  src: string;
  alt: string;
  onRemove?: () => void;
}

const ImagePreview: FC<ImagePreviewProps> = ({ src, alt, onRemove }) => (
  <AspectRatio ratio={1}>
    <Box position="relative" mx="auto" rounded="xl">
      <CloseButton
        color="white"
        rounded="full"
        position="absolute"
        right="2"
        top="2"
        onClick={() => onRemove?.()}
      />
      <Image rounded="xl" src={src} alt={alt} />
    </Box>
  </AspectRatio>
);

export default ImagePreview;
