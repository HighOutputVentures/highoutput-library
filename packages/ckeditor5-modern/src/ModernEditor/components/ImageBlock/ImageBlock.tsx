import React, { FC, useEffect, useState } from 'react';
import {
  Box,
  Image,
  CloseButton,
  Spinner,
  AspectRatio,
} from '@chakra-ui/react';

import {
  uploadFile,
  getUploadCrendentials,
} from '../../../services/uploadService';
import { IUploadMapResult, TParams } from '../../../types/upload';
import { FileAsset } from '../FileInput';

interface ImageBlockProps {
  fileAsset: FileAsset;
  uploadUrl?: string;
  onRemove: () => void;
  onUploadSuccess: (assetUrl: string) => void;
  loading?: boolean;
}

const ImageBlock: FC<ImageBlockProps> = ({
  fileAsset,
  uploadUrl,
  onRemove,
  onUploadSuccess,
  loading = false,
}) => {
  const { actualFile, linkSrc } = fileAsset;

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadFileAction = async (fileToUpload: File) => {
    if (!uploadUrl) return;
    try {
      setUploading(true);
      setUploadProgress(0);

      const uploadCredential: IUploadMapResult = await getUploadCrendentials({
        type: fileToUpload.type.split('/')[0],
        filename: fileToUpload.name,
        apiUrl: uploadUrl,
        file: fileToUpload,
      });

      const formData = new FormData();

      Object.keys(uploadCredential.data.params).forEach(key => {
        formData.append(
          key,
          uploadCredential.data.params[key as keyof TParams]
        );
      });
      formData.append('Content-Type', fileToUpload.type);
      formData.append('file', fileToUpload);

      // upload the file with credentials
      await uploadFile({
        apiUrl: uploadCredential.data.origin || '',
        data: formData,
        onLoadProgress: setUploadProgress,
      });
      onUploadSuccess(uploadCredential.data.url);
      setUploading(false);
    } catch (error) {
      setUploading(false);
    }
  };

  useEffect(() => {
    if (uploadUrl && actualFile) uploadFileAction(actualFile);
  }, [actualFile]);

  return (
    <Box position="relative">
      {!uploading && !loading && (
        <CloseButton
          zIndex={1}
          onClick={onRemove}
          bg="gray.500"
          borderRadius="full"
          color="white"
          position="absolute"
          w={4}
          h={4}
          fontSize="6px"
          right="-6px"
          top="-6px"
          _hover={{
            bg: 'gray.500',
          }}
        />
      )}
      <AspectRatio ratio={1}>
        <>
          <Image
            objectFit="cover"
            borderRadius="md"
            fallback={<Spinner size="sm" />}
            src={linkSrc}
            border="1px solid #EDF2F7"
          />
          {uploading && (
            <Box
              borderRadius="md"
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
              {uploadProgress ? `${Math.round(uploadProgress)}%` : <Spinner />}
            </Box>
          )}
        </>
      </AspectRatio>
    </Box>
  );
};

export default ImageBlock;
