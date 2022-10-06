import { ComponentStyleConfig } from '@chakra-ui/react';

export const Button: ComponentStyleConfig = {
  baseStyle: {
    _focus: { boxShadow: 'none' },
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: '8px',
    color: 'neutrals.100',
    outline: 'none',
  },
  variants: {
    primary: {
      color: 'neutrals.100',
      bg: 'brand.primary.700',
      p: '8px 14px',
      borderRadius: '8px',
      _hover: {
        bg: 'brand.primary.700',
        _disabled: {
          bg: 'brand.primary.500',
        },
      },
      _disabled: {
        bg: 'brand.primary.500',
      },
    },
  },
  defaultProps: {
    variant: 'primary',
  },
};

export default Button;
