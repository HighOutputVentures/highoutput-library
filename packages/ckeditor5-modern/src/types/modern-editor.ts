import { ReactNode } from 'react';
import { Mentionable } from 'hov-ckeditor5';

export interface ModernEditorProps {
  editorTrigger: ReactNode;
  categories: Array<{ label: string; value: string }>;
  defaultCategory: string;
  defaultContent: string;
  mentionables: Mentionable[];
  placeholder?: string;
}
