import React from 'react';

import HovRadioImage from './HovRadioImage';

export default {
  title: 'HovRadio',
  component: HovRadioImage,
};

export const RadioImage = () => {
  return (
    <HovRadioImage
      value={'Kat'}
      image={'https://randomuser.me/api/portraits/women/44.jpg'}
    />
  );
};
