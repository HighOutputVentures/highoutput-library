import React, { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { HOVEditor, EditorTypes } from 'hov-ckeditor5';
import {
  SimpleGrid,
  Box,
  Flex,
  Button,
  Divider,
  Select,
} from '@chakra-ui/react';
import { FaImage } from 'react-icons/fa';

import ModalContainer from './components/ModalContainer';
import ImagePreview from './components/ImagePreview';
import FileInput from './components/FileInput';
import { ModernEditorProps } from '../types/modern-editor';
import { PostFormSchemaValues, postFormSchema } from './validation';

const ModernEditor: FC<ModernEditorProps> = ({
  categories,
  defaultCategory,
  defaultContent,
  editorTrigger,
  mentionables,
  placeholder = 'What would you like to highlight?',
}) => {
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
    <ModalContainer
      modalTrigger={editorTrigger}
      headerComponent={
        <Select
          mx="auto"
          maxW="50%"
          placeholder="Select category"
          {...register('category')}
        >
          {categories.map(c => (
            <option value={c.value} key={c.value}>
              {c.label}
            </option>
          ))}
        </Select>
      }
    >
      <form
        style={{ width: '100%' }}
        onSubmitCapture={e => {
          e.preventDefault();
          handleSubmit(v => console.log(v));
        }}
      >
        <Box maxH="470px" overflowY="scroll">
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
        <Divider colorScheme="blue" pt="4" mb="4" />
        <Flex justifyContent="space-between">
          <Box>
            <FileInput
              acceptedFileTypes="image/*"
              label="Image upload"
              icon={<FaImage />}
              setFiles={setFiles}
            />
          </Box>
          <Button
            type="submit"
            variant="solid"
            isDisabled={isSubmitting || isValid}
          >
            Post
          </Button>
        </Flex>
      </form>
    </ModalContainer>
  );
};

export default ModernEditor;
export { ModernEditorProps } from '../types/modern-editor';
