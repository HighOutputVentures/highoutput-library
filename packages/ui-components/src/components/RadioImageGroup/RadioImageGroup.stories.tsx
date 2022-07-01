import { Text } from '@chakra-ui/react';
import React, { useState } from 'react';

import RadioImageGroup from './RadioImageGroup';

export default {
  title: 'UI Components/Radio/Radio Image Group',
  component: RadioImageGroup,
};

export const Default = () => {
  const [value, setValue] = useState('');

  return (
    <>
      <Text>Select Image: {value}</Text>
      <RadioImageGroup
        avatars={[
          {
            value: 'Kat',
            image: 'https://randomuser.me/api/portraits/women/44.jpg',
          },
          {
            value: 'Kevin',
            image: 'https://randomuser.me/api/portraits/men/86.jpg',
          },
          {
            value: 'Andy',
            image: 'https://randomuser.me/api/portraits/men/29.jpg',
          },
          {
            value: 'Jess',
            image: 'https://randomuser.me/api/portraits/women/95.jpg',
          },
        ]}
        onChange={v => setValue(v)}
      />
    </>
  );
};
