import React, { FC, useState } from 'react';

interface NeyarTextProps {
  data: string;
  readOnly?: boolean;
  onKeyUp?(): void;
}

const NeyarText: FC<NeyarTextProps> = ({ data, readOnly, onKeyUp }) => {
  const [isMentionPressed, setMentionPressed] = useState<boolean>(false);
  const [currentSelection, setCurrentSelection] = useState<Selection | null>();

  const checkPressed = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === '@') {
      setMentionPressed(true);
    }
  };

  const getContent = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (isMentionPressed) {
      setCurrentSelection(event.view.document.getSelection());
      const editorMention = document.getElementById('hov-editor-mention');
      if (editorMention) editorMention.focus();
    }

    if (onKeyUp) onKeyUp();
  };

  console.log(currentSelection);

  return (
    <>
      <div
        tabIndex={0}
        id="hov-editor"
        contentEditable={!readOnly}
        onKeyDown={checkPressed}
        onKeyUp={getContent}
        dangerouslySetInnerHTML={{ __html: data }}
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
        }}
        onBlur={() => setMentionPressed(false)}
      >
        mention here
      </div>
    </>
  );
};

export default NeyarText;
