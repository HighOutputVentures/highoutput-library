import React, { FC, useState } from 'react';

interface NeyarTextProps {
  data: string;
  readOnly?: boolean;
  onKeyUp?(): void;
}

const NeyarText: FC<NeyarTextProps> = ({ data, readOnly, onKeyUp }) => {
  const [isMentionPressed, setMentionPressed] = useState<boolean>(false);

  const checkPressed = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === '@') {
      setMentionPressed(true);
    }
  };

  const getContent = (event: React.KeyboardEvent<HTMLDivElement>) => {
    let content = event.currentTarget.innerHTML;
    console.log(content);

    if (isMentionPressed) {
      const editorMention = document.getElementById('hov-editor-mention');
      if (editorMention) editorMention.focus();
    }

    if (onKeyUp) onKeyUp();
  };

  return (
    <>
      <div
        tabIndex={0}
        contentEditable={!readOnly}
        onKeyDown={checkPressed}
        onKeyUp={getContent}
        dangerouslySetInnerHTML={{ __html: data }}
        style={{ lineHeight: 1.5, outline: 'none' }}
      />

      <div
        tabIndex={1}
        id="hov-editor-mention"
        style={{ display: !isMentionPressed ? 'none' : 'block' }}
        onBlur={() => setMentionPressed(false)}
      >
        mention here
      </div>
    </>
  );
};

export default NeyarText;
