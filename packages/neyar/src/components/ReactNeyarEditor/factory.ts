import { EditorConfig } from '@editorjs/editorjs';

import { EditorCore } from './editor-core';
import { MentionProps } from '../NeyarText/NeyarText';

export interface EditorConfigCoreFactory extends EditorConfig {
  mentions?: MentionProps[];
}
export type EditorCoreFactory = (config: EditorConfigCoreFactory) => EditorCore;
