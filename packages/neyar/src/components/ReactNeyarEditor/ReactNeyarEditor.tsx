import React from 'react';
import { useRef, useEffect, FC } from 'react';

import { Props } from './component-types';
import { EditorCore } from './editor-core';

const ReactEditorJS: FC<Props> = ({
  factory,
  holder,
  defaultValue,
  children,
  value,
  onInitialize,
  ...restProps
}) => {
  const memoizedHolder = useRef(
    holder ?? `hov-editor-${Date.now().toString(16)}`
  );

  const editorJS = useRef<EditorCore | null>(null);

  useEffect(() => {
    editorJS.current = factory({
      holder: memoizedHolder.current,
      ...(defaultValue && { data: defaultValue }),
      ...restProps,
    });

    onInitialize?.(editorJS.current);

    return () => {
      editorJS.current?.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (value) {
      editorJS.current?.render(value);
    }
  }, [value]);

  return (
    children || <div id={memoizedHolder.current} style={{ width: '100%' }} />
  );
};

export default ReactEditorJS;
