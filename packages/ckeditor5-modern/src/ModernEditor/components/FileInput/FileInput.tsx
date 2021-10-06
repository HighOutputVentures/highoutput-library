import React, { FC, useRef, Dispatch } from 'react';
import { Button, Input, Icon } from '@chakra-ui/react';
import { UploadIcon } from '@heroicons/react/solid';
import { v4 as uuid } from 'uuid';

export type FileAsset = {
  id: string;
  actualFile?: File;
  linkSrc: string;
};

interface FileInputProps {
  disabled: boolean;
  acceptedFileTypes?: string;
  setFileAssets: Dispatch<React.SetStateAction<FileAsset[]>>;
}

const FileInput: FC<FileInputProps> = ({
  acceptedFileTypes,
  setFileAssets,
  disabled,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  return (
    <>
      <Input
        hidden
        multiple
        type="file"
        accept={acceptedFileTypes}
        onChange={e => {
          const filesArray = e.target.files ? Array.from(e.target.files) : [];
          // reformat selected files here
          const formattedFileAssets = filesArray.map(f => ({
            id: uuid(),
            actualFile: f,
            linkSrc: URL.createObjectURL(f),
          }));
          e.target.value = '';
          setFileAssets(v => [...v, ...formattedFileAssets]);
        }}
        ref={inputRef}
      />
      <Button
        disabled={disabled}
        variant="outline"
        leftIcon={<Icon as={UploadIcon} />}
        onClick={() => inputRef?.current?.click()}
      >
        Upload photo
      </Button>
    </>
  );
};

export default FileInput;
