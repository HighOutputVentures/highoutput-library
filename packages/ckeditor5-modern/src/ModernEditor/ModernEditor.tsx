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
  const [currentLoading, setUploadCurrentLoading] = useState<number>(0);
  const [totaLoading, setUploadTotalLoading] = useState<number>(0);
  const [isUploadLoading, setUploadLoading] = useState<boolean>(false);
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

  // upload to api here
  const uploadFiles = (files: File[]) => {
    try {
      setUploadLoading(true);
      setUploadCurrentLoading(0);
      setUploadTotalLoading(files.length * 100);
      let currentTotal: number[] = [];

      const url: Promise<string>[] = files.map(
        async (file: File, index: number) => {
          const formData = new FormData();
          const data = await uploadGetCrendentials({
            type: file.type.split('/')[0],
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
            onLoadProgress: (total: number) => {
              currentTotal[index] = total;
              setUploadCurrentLoading(currentTotal.reduce((a, b) => a + b, 0));
            },
          });

          return Promise.resolve(data.url);
        }
      );

      Promise.all(url).then(dataUrl => {
        if (onUploadSuccess) onUploadSuccess(dataUrl);
        setUploadLoading(false);
      });
    } catch (error) {
      setUploadLoading(false);
    }
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
              <ImageGrid
                images={images}
                onRemove={() => setFiles([])}
                isLoading={isUploadLoading}
                totalLoading={totaLoading}
                currentLoading={currentLoading}
              />
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
                  disabled={disabled || loading || isUploadLoading}
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
              disabled={disabled || loading || isUploadLoading}
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
              disabled={disabled || loading || isUploadLoading}
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
