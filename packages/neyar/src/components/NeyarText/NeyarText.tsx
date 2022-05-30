import React, { FC, useMemo, useState } from 'react';

interface NeyarTextProps {
  data: string;
  readOnly?: boolean;
  onKeyUp?(): void;
}

const NeyarText: FC<NeyarTextProps> = ({ data, readOnly }) => {
  const [isMentionPressed, setMentionPressed] = useState<boolean>(false);
  const [currentSelection, setCurrentSelection] = useState<number>(0);
  const [textData, setTextData] = useState<string>(useMemo(() => data, [data]));
  const [content, setContent] = useState<string>('');

  const checkPressed = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const selection = event.view.document.getSelection();

    if (event.key === '@') {
      if (selection) {
        const { focusOffset } = selection;
        setMentionPressed(true);
        setCurrentSelection(focusOffset + 1);
      }
    }
  };

  const getContent = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const innerContent = event.currentTarget.innerHTML;
    setContent(innerContent || '');
  };

  const onInsertMention = () => {
    const startContent = content.substring(0, currentSelection);
    const endContent = content.substring(currentSelection, content.length);
    setTextData(`${startContent}mention${endContent}`);
    setCurrentSelection(0);
    setMentionPressed(false);
  };

  return (
    <>
      <div
        tabIndex={0}
        id="hov-editor"
        contentEditable={!readOnly}
        onKeyDown={checkPressed}
        onKeyUp={getContent}
        dangerouslySetInnerHTML={{ __html: textData }}
        style={{ lineHeight: 1.5, outline: 'none' }}
      />

      <div
        tabIndex={1}
        id="hov-editor-mention"
        style={{
          display: !isMentionPressed ? 'none' : 'block',
          width: 300,
          border: 'solid 1px',
          outline: 'none',
          cursor: 'pointer',
        }}
        onBlur={() => setMentionPressed(false)}
        onClick={onInsertMention}
      >
        mention here
      </div>
    </>
  );
};

export default NeyarText;
