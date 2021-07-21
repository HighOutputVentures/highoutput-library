import React, { FC } from 'react';
import { Icon, IconProps } from '@chakra-ui/react';

export const ImageIcon: FC<Omit<IconProps, 'children' | 'css'>> = props => (
  <Icon width="32px" height="28px" viewBox="0 0 32 28" fill="none" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4 0C2.93913 0 1.92172 0.421427 1.17157 1.17157C0.421427 1.92172 0 2.93913 0 4V24C0 25.0609 0.421427 26.0783 1.17157 26.8284C1.92172 27.5786 2.93913 28 4 28H28C29.0609 28 30.0783 27.5786 30.8284 26.8284C31.5786 26.0783 32 25.0609 32 24V4C32 2.93913 31.5786 1.92172 30.8284 1.17157C30.0783 0.421427 29.0609 0 28 0H4ZM28 24H4L12 8L18 20L22 12L28 24Z"
      fill="#BFBFBF"
    />
  </Icon>
);
