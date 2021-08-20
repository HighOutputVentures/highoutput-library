import { ReactNode } from 'react';
import { Mentionable } from '@highoutput/ckeditor5';
import { PostFormSchemaValues } from '../ModernEditor/validation';

interface EditorConfig {
  editorTrigger: ReactNode;
  title?: string;
  placeholder?: string;
  btnColor?: string;
  btnText?: string;
}

interface UploadConfig {
  apiUrl: string;
}
export interface OnSubmitArgs extends PostFormSchemaValues {
  files: File[];
}

export interface ModernEditorProps {
  disabled?: boolean;
  loading?: boolean;
  onSubmit?: (values: OnSubmitArgs, onClose: () => void) => void;
  categories: Array<{ label: string; value: string }>;
  defaultCategory: string;
  defaultContent: string;
  mentionables: Mentionable[];
  editorConfig: EditorConfig;
  uploadConfig?: UploadConfig;
  onUploadSuccess?(url: string[]): void;
}
