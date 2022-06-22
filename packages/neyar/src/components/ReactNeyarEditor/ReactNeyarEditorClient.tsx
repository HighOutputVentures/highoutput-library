import React from 'react';
import { FC, useCallback } from 'react';
import {
  WrapperProps as Props,
  ReactNeyarEditor,
  ClientEditorCore,
  EditorConfigCoreFactory,
} from '.';

const ReactEditorJSClient: FC<Props> = props => {
  const factory = useCallback(
    (config: EditorConfigCoreFactory) => new ClientEditorCore(config),
    []
  );
  return <ReactNeyarEditor factory={factory} {...props} />;
};

export default ReactEditorJSClient;
