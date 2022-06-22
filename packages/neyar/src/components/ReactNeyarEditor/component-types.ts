import React from 'react';
import { EditorConfig } from '@editorjs/editorjs';

import { EditorCoreFactory } from './factory';
import { EditorCore } from './editor-core';
import { MentionProps } from '../NeyarText/NeyarText';

export interface Props extends Omit<EditorConfig, 'data'> {
  factory: EditorCoreFactory;

  holder?: string;
  children?: React.ReactElement;
  value?: EditorConfig['data'];
  defaultValue?: EditorConfig['data'];

  onInitialize?: (core: EditorCore) => void;
  mentions?: MentionProps[];
}

export type WrapperProps = Omit<Props, 'factory'>;
