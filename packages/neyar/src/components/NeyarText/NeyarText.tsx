import React, { FC } from 'react';

interface NeyarTextProps {
  data: string;
  readOnly?: boolean;
  onKeyUp?(): void;
}

const NeyarText: FC<NeyarTextProps> = ({ data, readOnly, onKeyUp }) => {
  const onKeyUpNeyarText = (event: React.KeyboardEvent<HTMLDivElement>) => {
    let text = event.currentTarget.textContent;
    console.log(event, text);

    if (onKeyUp) onKeyUp();
  };

  return (
    <div
      contentEditable={!readOnly}
      onKeyUp={onKeyUpNeyarText}
      dangerouslySetInnerHTML={{ __html: data }}
      style={{ lineHeight: 1.5, outline: 'none' }}
    />
  );
};

export default NeyarText;
