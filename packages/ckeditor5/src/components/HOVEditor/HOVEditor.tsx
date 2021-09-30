import React, { FC, useEffect, useMemo, useRef, useState } from 'react';

import { EditorTypes, HOVEditorProps } from '../../types/hov-editor';
import {
  getEmojiFeed,
  getToolbars,
  getPlugins,
  getDisplayName,
  moveCursorToEnd,
  handleEscapeKey,
  handleEnterKey,
  emojiItemRenderer,
  mentionItemRenderer,
} from '../../utils/editorUtils';

const HOVEditor: FC<HOVEditorProps> = props => {
  const {
    editorType,
    value,
    onChange,
    placeholder,
    mentionables = [],
    disabled = false,
  } = props;

  const editorToobars = useMemo(() => getToolbars(editorType), [editorType]);
  const editorPlugins = useMemo(() => getPlugins(mentionables, editorType), [
    mentionables,
    editorType,
  ]);

  const editorRef = useRef<any>();
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [classicLoaded, setClassicLoaded] = useState(false);
  const { CKEditor, ClassicEditor } = editorRef.current || {};

  useEffect(() => {
    import('@ckeditor/ckeditor5-react').then(ck => {
      editorRef.current = {
        ...editorRef.current,
        CKEditor: ck.CKEditor,
      };

      setEditorLoaded(true);
    });

    import('ckeditor5-custom-build').then(ck => {
      editorRef.current = {
        ...editorRef.current,
        ClassicEditor: ck.ClassicEditor,
      };

      setClassicLoaded(true);
    });
  }, []);

  return editorLoaded && classicLoaded ? (
    <CKEditor
      editor={ClassicEditor}
      disabled={disabled}
      config={{
        extraPlugins: editorPlugins,
        ...(editorToobars.length && {
          toolbar: {
            items: editorToobars,
          },
        }),
        mention: {
          feeds: [
            {
              marker: '@',
              feed: mentionables.map(m => `@${getDisplayName(m)}`),
              itemRenderer: (item: any) =>
                mentionItemRenderer(item, mentionables),
            },
            {
              marker: ':',
              feed: getEmojiFeed(),
              itemRenderer: emojiItemRenderer,
            },
          ],
        },
        ...(props.editorType === EditorTypes.CLASSIC && {
          s3Upload: {
            policyUrl: props.policy.url,
            token: props.policy.token,
          },
        }),
        placeholder,
      }}
      onReady={(editor: any) => {
        if (editor) {
          const command = editor.commands.get('mention');
          command.on('execute', (_: any, data: any) => {
            if (data[0].marker === ':') {
              // run replacer function for emojis
              const emoji = data[0].mention.emoji;
              const currentMarkDownData = editor.getData();
              const newData = currentMarkDownData.replaceAll(/:\S*:/gi, emoji);
              editor.setData(newData);
              moveCursorToEnd(editor);
            }
          });

          if (props.editorType === EditorTypes.COMMENT) {
            // should only be triggered when there's an initial value
            // usually happens when editing
            if (value) {
              moveCursorToEnd(editor);
              handleEscapeKey(editor, props.onEscape);
            }
            handleEnterKey(editor, props.onEnter);
          } else {
            onChange(editor.getData());
          }
          // setEditorInstance(editor);
        }
      }}
      data={value}
      onChange={(_: any, editor: any) => onChange(editor.getData())}
    />
  ) : null;
};

export default HOVEditor;
export {
  EditorTypes,
  Mentionable,
  HOVEditorProps,
} from '../../types/hov-editor';
