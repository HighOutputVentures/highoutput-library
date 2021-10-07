import { Mentionable } from '@highoutput/ckeditor5';
import { ColorProps, LayoutProps } from '@chakra-ui/react'
import { PostFormSchemaValues } from '../ModernEditor/validation';

type BtnType = {
  text?: string;
  bg?: ColorProps['color'];
}

interface EditorConfig {
  placeholder?: string;
  okBtn?: BtnType;
  cancelBtn?: BtnType & { onClick?: () => void };
  maxH?: LayoutProps['maxH'];
  minH?: LayoutProps['minH'];
}

interface UploadConfig {
  apiUrl: string;
}
export interface OnSubmitArgs extends PostFormSchemaValues {
  uploadedFiles: string[];
}

export interface ModernEditorProps {
  disabled?: boolean;
  loading?: boolean;
  onSubmit?: (values: OnSubmitArgs) => void;
  defaultContent: string;
  defaultImages: string[];
  mentionables: Mentionable[];
  editorConfig: EditorConfig;
  uploadConfig?: UploadConfig;
}
