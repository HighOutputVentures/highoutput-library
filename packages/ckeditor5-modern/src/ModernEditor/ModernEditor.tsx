import React, { FC, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { HOVEditor, EditorTypes } from '@highoutput/ckeditor5';
import { Box, Flex, HStack, Button, SimpleGrid } from '@chakra-ui/react';
import { v4 as uuid } from 'uuid';

import FileInput, { FileAsset } from './components/FileInput';
import ImageBlock from './components/ImageBlock';
import { ModernEditorProps } from '../types/modern-editor';
import { PostFormSchemaValues, postFormSchema } from './validation';
import { MODERN_EDITOR_STYLE } from '../utils/styleUtils';
import { notEmpty } from '../utils/typescriptUtils';

const ModernEditor: FC<ModernEditorProps> = ({
  defaultContent,
  defaultImages,
  mentionables,
  editorConfig,
  uploadConfig,
  disabled = false,
  loading = false,
  onSubmit,
}) => {
  const {
    placeholder = 'What would you like to highlight?',
    okBtn = {
      bg: '#FFC53D',
      text: 'Share post',
    },
    cancelBtn,
    maxH = '470px',
    minH = '175px',
    editorStyle = MODERN_EDITOR_STYLE,
  } = editorConfig;

  // reformat default images
  const formattedDefaultImages = useMemo(
    () =>
      defaultImages.map(defaultImage => ({
        id: uuid(),
        linkSrc: defaultImage,
      })),
    [defaultImages]
  );

  const [fileAssets, setFileAssets] = useState<FileAsset[]>(
    formattedDefaultImages
  );

  const { register, getValues, setValue, formState, handleSubmit } = useForm<
    PostFormSchemaValues
  >({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(postFormSchema),
    defaultValues: {
      content: defaultContent,
    },
  });

  useEffect(() => {
    register('content');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onUploadSuccess = (uploadedUrl: string, assetId: string) => {
    const uploadedFileAsset = fileAssets.find(f => f.id === assetId);
    if (uploadedFileAsset) {
      uploadedFileAsset.linkSrc = uploadedUrl;
      setFileAssets(fileAssets);
    }
  };

  const { isSubmitting, errors } = formState;
  const values = getValues();

  return (
    <form
      style={{ width: '100%' }}
      onSubmit={handleSubmit(v =>
        onSubmit?.({
          ...v,
          uploadedFiles: fileAssets.map(f => f.linkSrc).filter(notEmpty),
        })
      )}
    >
      <Box
        bg="#FAFAFA"
        borderRadius="lg"
        mb={4}
        p={4}
        maxH={maxH}
        minH={minH}
        overflowY="auto"
        sx={editorStyle}
        {...(errors.content && {
          borderWidth: 1,
          borderColor: 'red.500',
        })}
      >
        <HOVEditor
          disabled={disabled || loading}
          value={values.content || ''}
          onChange={v =>
            setValue('content', v, {
              shouldDirty: true,
              shouldTouch: true,
              shouldValidate: Boolean(v),
            })
          }
          placeholder={placeholder}
          editorType={EditorTypes.MODERN}
          mentionables={mentionables}
        />
        {Boolean(fileAssets.length) && (
          <Box mt={4}>
            <SimpleGrid columns={7} spacing={4} mt={4}>
              {fileAssets.map(fileAsset => (
                <ImageBlock
                  loading={loading}
                  fileAsset={fileAsset}
                  key={fileAsset.id}
                  uploadUrl={uploadConfig?.apiUrl}
                  onUploadSuccess={v => onUploadSuccess(v, fileAsset.id)}
                  onRemove={() =>
                    setFileAssets(f => f.filter(f => f.id !== fileAsset.id))
                  }
                />
              ))}
            </SimpleGrid>
          </Box>
        )}
      </Box>
      <Flex justifyContent="space-between">
        <Box>
          <FileInput
            disabled={disabled || loading}
            acceptedFileTypes="image/*"
            setFileAssets={setFileAssets}
          />
        </Box>
        <HStack spacing={4}>
          {cancelBtn && (
            <Button
              disabled={disabled || loading}
              flexShrink={0}
              variant="outline"
              bgColor={cancelBtn.bg}
              isDisabled={isSubmitting}
              onClick={cancelBtn.onClick}
            >
              {cancelBtn.text}
            </Button>
          )}
          <Button
            isLoading={loading}
            disabled={disabled || loading}
            flexShrink={0}
            type="submit"
            variant="solid"
            bgColor={okBtn.bg}
            isDisabled={isSubmitting}
          >
            {okBtn.text}
          </Button>
        </HStack>
      </Flex>
    </form>
  );
};

export default ModernEditor;
