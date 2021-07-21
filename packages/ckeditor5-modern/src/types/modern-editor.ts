import { ReactNode } from 'react';
import { Mentionable } from '@highoutput/ckeditor5';

interface EditorConfig {
  editorTrigger: ReactNode;
  title?: string;
  placeholder?: string;
  btnColor?: string;
  btnText?: string;
}

export interface ModernEditorProps {
  categories: Array<{ label: string; value: string }>;
  defaultCategory: string;
  defaultContent: string;
  mentionables: Mentionable[];
  editorConfig: EditorConfig;
}
