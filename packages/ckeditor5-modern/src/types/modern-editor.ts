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

export interface ModernEditorProps {
  disabled?: boolean;
  loading?: boolean;
  onSubmit?: (values: PostFormSchemaValues & { files: File[] }) => void;
  categories: Array<{ label: string; value: string }>;
  defaultCategory: string;
  defaultContent: string;
  mentionables: Mentionable[];
  editorConfig: EditorConfig;
}
