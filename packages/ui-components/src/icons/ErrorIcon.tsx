import { Icon, IconProps } from '@chakra-ui/react';
import React, { FC } from 'react';

const HovIcon: FC<Omit<IconProps, 'children' | 'css'>> = props => (
  <Icon width="16" height="16" viewBox="0 0 16 16" fill="none" {...props}>
    <path
      d="M7.99992 5.33337V8.00004M7.99992 10.6667H8.00659M14.6666 8.00004C14.6666 11.6819 11.6818 14.6667 7.99992 14.6667C4.31802 14.6667 1.33325 11.6819 1.33325 8.00004C1.33325 4.31814 4.31802 1.33337 7.99992 1.33337C11.6818 1.33337 14.6666 4.31814 14.6666 8.00004Z"
      stroke="#DC180C"
      stroke-width="1.33333"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </Icon>
);

export default HovIcon;
