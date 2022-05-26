import React, { FC } from 'react';

interface NeyarTextProps {
  data: string;
  readOnly?: boolean;
}

const NeyarText: FC<NeyarTextProps> = ({ data, readOnly }) => {
  const onKeyUpNeyarText = () => {
    // e: React.KeyboardEvent<HTMLDivElement>
    // console.log(e);
  };

  const onChangeNeyarText = (e: React.FormEvent<HTMLDivElement>) => {
    console.log('onchange', e);
  };

  return (
    <div
      contentEditable={!readOnly}
      onKeyUp={onKeyUpNeyarText}
      onChange={onChangeNeyarText}
      dangerouslySetInnerHTML={{ __html: data }}
    />
  );
};

export default NeyarText;
