import React from 'react';

import HovRadioImage from './RadioImage';

export default {
  title: 'Hov UI Components/Hov Radio/Radio Image',
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
