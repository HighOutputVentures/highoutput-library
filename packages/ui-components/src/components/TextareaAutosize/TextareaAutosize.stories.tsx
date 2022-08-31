import { Text } from '@chakra-ui/react';
import * as React from 'react';
import TextareaAutosize from './TextareaAutosize';

export default {
  title: 'Components/Textarea/Textarea Autosize',
  component: TextareaAutosize,
};

export const Default = () => {
  const [value, setValue] = React.useState('Type here...');

  return (
    <>
      <Text fontSize="sm">{value}</Text>

      <TextareaAutosize
        mt={4}
        minRows={2}
        maxRows={4}
        value={value}
        onChange={e => setValue(e.target.value)}
      />
    </>
  );
};
