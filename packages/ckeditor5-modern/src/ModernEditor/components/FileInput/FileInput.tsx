import React, { FC, useRef, Dispatch } from 'react';
import { IconButton, Input } from '@chakra-ui/react';

interface FileInputProps {
  acceptedFileTypes?: string;
  icon: JSX.Element;
  label: string;
  setFiles: Dispatch<React.SetStateAction<File[]>>;
}

const FileInput: FC<FileInputProps> = ({
  acceptedFileTypes,
  icon,
  label,
  setFiles,
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
          e.target.value = '';
          setFiles(filesArray);
        }}
        ref={inputRef}
      />
      <IconButton
        variant="ghost"
        icon={icon}
        fontSize="2xl"
        aria-label={label}
        onClick={() => inputRef?.current?.click()}
      />
    </>
  );
};

export default FileInput;
