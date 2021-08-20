import React, { FC, useEffect, useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { HOVEditor, EditorTypes } from '@highoutput/ckeditor5';
import {
  Box,
  Flex,
  Button,
  Select,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react';

import ModalContainer from './components/ModalContainer';
import ImageGrid from './components/ImageGrid';
import FileInput from './components/FileInput';
import { ModernEditorProps } from '../types/modern-editor';
import { ImageIcon } from '../icons/ImageIcon';
import { MODERN_EDITOR_STYLE } from '../utils/styleUtils';
import { PostFormSchemaValues, postFormSchema } from './validation';
import _ from 'lodash';
import { uploadFile, uploadGetCrendentials } from '../services/uploadService';

const ModernEditor: FC<ModernEditorProps> = ({
  categories,
  defaultCategory,
  defaultContent,
  mentionables,
  editorConfig,
  uploadConfig,
  disabled = false,
  loading = false,
  onSubmit,
  onUploadSuccess,
}) => {
  const {
    editorTrigger,
    title = 'Create a post',
    placeholder = 'What would you like to highlight?',
    btnColor = '#FFC53D',
    btnText = 'Share post',
  } = editorConfig;

  const [files, setFiles] = useState<File[]>([]);
  const modalDisclosure = useDisclosure();

  const { register, getValues, setValue, formState, handleSubmit } = useForm<
    PostFormSchemaValues
  >({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(postFormSchema),
    defaultValues: {
      content: defaultContent,
      category: defaultCategory,
    },
  });

  useEffect(() => {
    register('content');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { isSubmitting } = formState;
  const values = getValues();

  const images = useMemo(() => files.map(file => URL.createObjectURL(file)), [
    files,
  ]);

  const uploadFiles = (files: File[]) => {
    try {
      const url: Promise<string>[] = files.map(async (file: File) => {
        const formData = new FormData();
        const data = await uploadGetCrendentials({
          type: 'image',
          filename: file.name,
          apiUrl: uploadConfig?.apiUrl || '',
        });

        Object.keys(data.params).forEach(key => {
          formData.append(key, data.params[key]);
        });

        formData.append('Content-Type', file.type);
        formData.append('file', file);

        await uploadFile({
          apiUrl: data.origin || '',
          data: formData,
        });

        return Promise.resolve(data.url);
      });

      Promise.all(url).then(dataUrl => {
        if (onUploadSuccess) onUploadSuccess(dataUrl);
      });
    } catch (error) {}
  };

  useEffect(() => {
    if (!_.isEmpty(uploadConfig)) uploadFiles(files);
  }, [files]);

  return (
    <ModalContainer
      disclosure={modalDisclosure}
      modalTrigger={editorTrigger}
      title={title}
    >
      <form
        style={{ width: '100%' }}
        onSubmit={handleSubmit(v =>
          onSubmit?.({ ...v, files }, modalDisclosure.onClose)
        )}
      >
        <Box
          maxH="470px"
          minH="175px"
          overflowY="auto"
          mr="1"
          my="1"
          pr="1"
          sx={MODERN_EDITOR_STYLE}
        >
          <HOVEditor
            disabled={disabled || loading}
            value={values.content || ''}
            onChange={v => setValue('content', v)}
            placeholder={placeholder}
            editorType={EditorTypes.MODERN}
            mentionables={mentionables}
          />
          {Boolean(images.length) && (
            <Box pl="8" pr="4" py="4">
              <ImageGrid images={images} onRemove={() => setFiles([])} />
            </Box>
          )}
        </Box>
        <Flex
          justifyContent="space-between"
          px="8"
          py="4"
          bgColor="#FAFAF9"
          borderEndStartRadius="md"
          borderEndEndRadius="md"
        >
          <Box>
            <Tooltip
              hasArrow
              label="Add image"
              aria-label="add image tooltip"
              placement="top"
              p="2"
              mb="2"
              borderRadius="md"
            >
              <span>
                <FileInput
                  disabled={disabled || loading}
                  acceptedFileTypes="image/*"
                  label="Image upload"
                  icon={<ImageIcon />}
                  setFiles={setFiles}
                />
              </span>
            </Tooltip>
          </Box>
          <Flex>
            <Select
              disabled={disabled || loading}
              bg="white"
              minW="186px"
              mr="4"
              placeholder="Select category"
              {...register('category')}
            >
              {categories.map(c => (
                <option value={c.value} key={c.value}>
                  {c.label}
                </option>
              ))}
            </Select>
            <Button
              disabled={disabled || loading}
              flexShrink={0}
              type="submit"
              variant="solid"
              bgColor={btnColor}
              isDisabled={isSubmitting}
            >
              {btnText}
            </Button>
          </Flex>
        </Flex>
      </form>
    </ModalContainer>
  );
};

export default ModernEditor;
export { ModernEditorProps, OnSubmitArgs } from '../types/modern-editor';
