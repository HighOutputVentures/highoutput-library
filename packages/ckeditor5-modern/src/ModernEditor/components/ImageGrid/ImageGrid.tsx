import React, { FC } from 'react';
import { Box, SimpleGrid, CloseButton } from '@chakra-ui/react';

interface ImageGridProps {
  maxDisplay?: number;
  images: string[];
  onImageClick?: (_: { index: number; src: string }) => void;
  onRemove?: () => void;
}

interface ImagePreviewProps {
  count?: number;
  src: string;
  onClick?: () => void;
}

const MAXIMUM_DISPLAY = 5;
const MAX_HEIGHT = 512; // in pixels
const FIRST_ROW_HEIGHT = 65; // in percent
const SECOND_ROW_HEIGHT = 35; // in percent

const ImagePreview: FC<ImagePreviewProps> = ({ count, src, onClick }) => (
  <Box
    onClick={onClick}
    bgImage={`url(${src})`}
    backgroundSize="cover"
    backgroundPosition="center"
    backgroundRepeat="no-repeat"
    position="relative"
  >
    {count && (
      <Box
        fontSize="4xl"
        position="absolute"
        right="0"
        left="0"
        top="0"
        bottom="0"
        display="flex"
        justifyContent="center"
        alignItems="center"
        background="#212121b3"
        color="white"
      >
        +{count}
      </Box>
    )}
  </Box>
);

const ImageGrid: FC<ImageGridProps> = ({
  maxDisplay = MAXIMUM_DISPLAY,
  images,
  onImageClick,
  onRemove,
}) => {
  const numOfImgs = images.length;
  const derivedMaxDisplay =
    maxDisplay > 0 && maxDisplay <= MAXIMUM_DISPLAY
      ? maxDisplay
      : MAXIMUM_DISPLAY;
  const extraCount = numOfImgs - maxDisplay;

  const renderOne = () => {
    const showCountOverlay =
      numOfImgs > derivedMaxDisplay && derivedMaxDisplay === 1;
    return (
      <SimpleGrid
        w="full"
        h={
          numOfImgs === 1 || maxDisplay === 1 ? 'full' : `${FIRST_ROW_HEIGHT}%`
        }
      >
        <ImagePreview
          src={images[0]}
          onClick={() => onImageClick?.({ index: 0, src: images[0] })}
          {...(showCountOverlay && { count: extraCount })}
        />
      </SimpleGrid>
    );
  };

  const renderTwo = () => {
    let height = FIRST_ROW_HEIGHT;
    if (numOfImgs === 2 || derivedMaxDisplay === 2) {
      height = 100;
    } else if (numOfImgs === 3 || derivedMaxDisplay === 3) {
      height = SECOND_ROW_HEIGHT;
    }

    const showCountOverlay =
      numOfImgs > derivedMaxDisplay && [2, 3].includes(derivedMaxDisplay);
    const conditionalRender = numOfImgs === 3 || numOfImgs > derivedMaxDisplay;
    const imgSrc1 = conditionalRender ? images[1] : images[0];
    const imgSrc2 = conditionalRender ? images[2] : images[1];

    return (
      <SimpleGrid w="full" h={`${height}%`} columns={2}>
        <ImagePreview
          src={imgSrc1}
          onClick={() => onImageClick?.({ index: 1, src: imgSrc1 })}
        />
        <ImagePreview
          src={imgSrc2}
          onClick={() => onImageClick?.({ index: 2, src: imgSrc2 })}
          {...(showCountOverlay && { count: extraCount })}
        />
      </SimpleGrid>
    );
  };

  const renderThree = () => {
    const showCountOverlay =
      numOfImgs > derivedMaxDisplay && [4, 5].includes(derivedMaxDisplay);
    const conditionalRender =
      numOfImgs === 4 ||
      (numOfImgs > derivedMaxDisplay && derivedMaxDisplay === 4);

    const imgSrc1 = conditionalRender ? images[1] : images[2];
    const imgSrc2 = conditionalRender ? images[2] : images[3];
    const imgSrc3 = conditionalRender ? images[3] : images[4];

    return (
      <SimpleGrid w="full" h={`${SECOND_ROW_HEIGHT}%`} columns={3}>
        <ImagePreview
          src={imgSrc1}
          onClick={() => onImageClick?.({ index: 3, src: imgSrc1 })}
        />
        <ImagePreview
          src={imgSrc1}
          onClick={() => onImageClick?.({ index: 4, src: imgSrc2 })}
        />
        <ImagePreview
          src={imgSrc2}
          onClick={() => onImageClick?.({ index: 5, src: imgSrc3 })}
          {...(showCountOverlay && { count: extraCount })}
        />
      </SimpleGrid>
    );
  };

  const imagesToShow =
    numOfImgs > derivedMaxDisplay ? derivedMaxDisplay : numOfImgs;

  return (
    <Box
      height={`${MAX_HEIGHT}px`}
      border="1px solid #E7E5E4"
      borderRadius="2xl"
      overflow="hidden"
      position="relative"
      cursor="pointer"
    >
      <CloseButton
        color="white"
        bg="#3e4042"
        _hover={{
          bg: '#3e4042bf',
        }}
        rounded="full"
        position="absolute"
        right="2"
        top="2"
        zIndex="1"
        onClick={() => onRemove?.()}
      />
      {[1, 3, 4].includes(imagesToShow) && renderOne()}
      {imagesToShow >= 2 && imagesToShow !== 4 && renderTwo()}
      {imagesToShow >= 4 && renderThree()}
    </Box>
  );
};

export default ImageGrid;
