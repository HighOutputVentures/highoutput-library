import React from 'react';

import RadioImage from './RadioImage';

export default {
  title: 'UI Components/Radio/Radio Image',
  component: RadioImage,
};

export const RadioImageComponent = () => {
  return (
    <RadioImage
      value={'Kat'}
      image={'https://randomuser.me/api/portraits/women/44.jpg'}
    />
  );
};
