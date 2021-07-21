import React, { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { HOVEditor, EditorTypes } from '@highoutput/ckeditor5';
import {
  SimpleGrid,
  Box,
  Flex,
  Button,
  Select,
  Tooltip,
} from '@chakra-ui/react';

import ModalContainer from './components/ModalContainer';
import ImagePreview from './components/ImagePreview';
import FileInput from './components/FileInput';
import { ModernEditorProps } from '../types/modern-editor';
import { ImageIcon } from '../icons/ImageIcon';
import { PostFormSchemaValues, postFormSchema } from './validation';

const ModernEditor: FC<ModernEditorProps> = ({
  categories,
  defaultCategory,
  defaultContent,
  mentionables,
  editorConfig,
}) => {
  const {
    editorTrigger,
    title = 'Create a post',
    placeholder = 'What would you like to highlight?',
    btnColor = '#FFC53D',
    btnText = 'Share post',
  } = editorConfig;

  const [files, setFiles] = useState<File[]>([]);

  const { register, getValues, setValue, handleSubmit, formState } = useForm<
    PostFormSchemaValues
  >({
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

  const { isSubmitting, isValid } = formState;
  const values = getValues();

  return (
    <ModalContainer modalTrigger={editorTrigger} title={title}>
      <form
        style={{ width: '100%' }}
        onSubmitCapture={e => {
          e.preventDefault();
          handleSubmit(v => console.log(v));
        }}
      >
        <Box maxH="470px" overflowY="auto">
          <HOVEditor
            value={values.content || ''}
            onChange={v => setValue('content', v)}
            placeholder={placeholder}
            editorType={EditorTypes.MODERN}
            mentionables={mentionables}
          />
          {Boolean(files.length) && (
            <SimpleGrid py="4" spacing="4" columns={files.length === 1 ? 1 : 2}>
              {files.map(file => (
                <ImagePreview
                  key={file.name}
                  alt={file.name}
                  src={URL.createObjectURL(file)}
                  onRemove={() =>
                    setFiles(files.filter(f => f.name !== file.name))
                  }
                />
              ))}
            </SimpleGrid>
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
              flexShrink={0}
              type="submit"
              variant="solid"
              bgColor={btnColor}
              isDisabled={isSubmitting || isValid}
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
export { ModernEditorProps } from '../types/modern-editor';
