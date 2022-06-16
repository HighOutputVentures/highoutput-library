import { ComponentStyleConfig } from '@chakra-ui/react';

export const Button: ComponentStyleConfig = {
  baseStyle: {
    _focus: { boxShadow: 'none' },
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: '4px',
    color: 'gray.800',
    outline: 'none',
  },
  variants: {
    link: {
      fontWeight: 'medium',
      color: 'sunglow.500',
    },
    primary: {
      bg: 'sunglow.500',
      p: '8px 16px',
      borderRadius: 'base',
      _hover: {
        bg: 'amber.600',
      },
      _disabled: {
        bg: 'gray.200',
      },
    },
    'tertiatry-error': {
      color: 'red.500',
      border: '1px solid',
      fontWeight: 'medium',
      fontSize: '1em',
      lineHeight: '1.5em',
      borderColor: 'red.500',
      _hover: {
        bg: 'red.50',
      },
    },
    'primary-circle': {
      bg: 'sunglow.500',
      borderRadius: 'full',
    },
    'solid-gray': {
      bg: 'gray.800',
      color: 'white',
      p: '8px 16px',
      borderRadius: 'base',
    },
    'upload-circle': {
      bg: 'gray.700',
      fontSize: 'xs',
      pos: 'absolute',
      border: '2px solid white',
      bottom: -2,
      right: -2,
      _loading: {
        opacity: 1,
        color: 'white',
      },
      borderRadius: 'full',
    },
    ghost: {
      _hover: { background: 'none' },
      p: '8px 16px',
      borderRadius: 'base',
    },
    'feed-card-button': { borderRadius: 0, w: 'full', d: 'flex' },
    'outline-follow': {
      bg: 'gray.800',
      color: 'white',
      p: '8px 16px',
      borderRadius: 'base',
    },
    'outline-unfollow': {
      color: 'red.500',
      border: '1px solid',
      borderColor: 'red.200',
      p: '8px 16px',
      borderRadius: 'base',
    },
    'outline-icon-button': {
      color: 'gray.600',
      border: '1px solid',
      borderColor: 'gray.200',
      borderRadius: '6px',
    },
  },
};

export default Button;
