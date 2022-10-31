import '@testing-library/jest-dom';
import { buttonSizes, buttonVariants } from '../button';

type VariantTypes =
  | 'solid-primary'
  | 'outline-primary'
  | 'ghost-primary'
  | 'solid-error'
  | 'outline-error'
  | 'ghost-error'
  | 'solid-close-btn'
  | 'outline-close-btn'
  | 'ghost-close-btn';
type ButtonSizeTypes =
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl'
  | 'button-close-lg'
  | 'button-close-sm'
  | 'button-close-md';

describe('Test button variants values', () => {
  const ButtonVariantTypes = (variant: VariantTypes, expected: any) => {
    test(`${variant} correct style json`, async () => {
      expect(JSON.stringify(buttonVariants[variant])).toBe(
        JSON.stringify(expected)
      );
    });
  };

  const solid_primary = {
    bg: 'brand.primary.700',
    color: 'neutrals.100',
    borderRadius: '4px',
    border: '1px solid #7070DD',

    boxShadow: '0px 1px 2px rgba(16, 24, 40, 0.05)',
    _hover: {
      bg: 'brand.primary.900',
      boxShadow: '0px 1px 2px rgba(16, 24, 40, 0.05), 0px 0px 0px 4px #F4EBFF',
      _disabled: {
        bg: 'brand.primary.500',
        border: 'none',
        boxShadow: '0px 1px 2px rgba(16, 24, 40, 0.05)',
      },
    },
    _active: {
      bg: 'brand.primary.900',
      boxShadow: '0px 1px 2px rgba(16, 24, 40, 0.05)',
    },
    _disabled: {
      bg: 'brand.primary.500',
      border: 'none',
      boxShadow: '0px 1px 2px rgba(16, 24, 40, 0.05)',
    },
  };
  const outline_primary = {
    color: 'neutrals.700',
    bg: 'white',
    border: '1px solid #D1D1D1',
    boxShadow: '0px 1px 2px rgba(16, 24, 40, 0.05)',
    borderRadius: '4px',
    _hover: {
      bg: '#FFFFFF',
      boxShadow: '0px 1px 2px rgba(16, 24, 40, 0.05), 0px 0px 0px 4px #F2F4F7',
      _disabled: {
        bg: '#FFFFFF',
        border: '1px solid #D1D1D1',
        boxShadow: '0px 1px 2px rgba(16, 24, 40, 0.05)',
      },
      border: '1px solid #D1D1D1',
    },
    _active: {
      bg: '#FFFFFF',
      border: '1px solid #D1D1D1',
      boxShadow: '0px 1px 2px rgba(16, 24, 40, 0.05)',
    },
    _disabled: {
      bg: '#FFFFFF',
      border: '1px solid #D1D1D1',
      boxShadow: '0px 1px 2px rgba(16, 24, 40, 0.05)',
    },
  };
  const ghost_primary = {
    color: 'brand.primary.700',
    bg: '#E3E3FC',
    border: '1px solid #E3E3FC',
    boxShadow: '0px 1px 2px rgba(16, 24, 40, 0.05)',
    borderRadius: '4px',
    _hover: {
      bg: '#E3E3FC',
      boxShadow: '0px 1px 2px rgba(16, 24, 40, 0.05), 0px 0px 0px 4px #F4EBFF',
      _disabled: {
        bg: '#E3E3FC',
        border: '1px solid #E3E3FC',
        boxShadow: '0px 1px 2px rgba(16, 24, 40, 0.05)',
      },
    },
    _active: {
      bg: '#C0C0FC',

      boxShadow: '0px 1px 2px rgba(16, 24, 40, 0.05)',
    },
    _disabled: {
      bg: '#E3E3FC',
      border: '1px solid #E3E3FC',
      boxShadow: '0px 1px 2px rgba(16, 24, 40, 0.05)',
    },
  };
  const solid_error = {
    bg: 'interface.error.700',
    color: 'neutrals.100',
    borderRadius: '4px',
    border: '1px solid #DC180C',
    boxShadow: '0px 1px 2px rgba(16, 24, 40, 0.05)',
    _hover: {
      bg: 'interface.error.700',
      border: '1px solid #DC180C',
      boxShadow: '0px 1px 2px rgba(16, 24, 40, 0.05), 0px 0px 0px 4px #FEE4E2',
      _disabled: {
        bg: '#FCEAE8',
        border: '1px solid #FCEAE8',
        boxShadow: '0px 1px 2px rgba(16, 24, 40, 0.05)',
      },
    },
    _active: {
      bg: 'interface.error.900',
      border: '1px solid #800C05',
      boxShadow: '0px 1px 2px rgba(16, 24, 40, 0.05)',
    },
    _disabled: {
      bg: '#FCEAE8',
      border: '1px solid #FCEAE8',
      boxShadow: '0px 1px 2px rgba(16, 24, 40, 0.05)',
    },
  };
  const outline_error = {
    bg: 'white',
    color: '#DC180C',
    borderRadius: '4px',
    border: '1px solid #DC180C',
    boxShadow: '0px 1px 2px rgba(16, 24, 40, 0.05)',
    _hover: {
      bg: 'white',
      border: '1px solid #DC180C',
      boxShadow: '0px 1px 2px rgba(16, 24, 40, 0.05), 0px 0px 0px 4px #FEE4E2',
      _disabled: {
        bg: '#FFFFFF',
        border: '1px solid #FCD2CF',
        boxShadow: '0px 1px 2px rgba(16, 24, 40, 0.05)',
      },
    },
    _active: {
      bg: 'interface.error.500',
      border: '1px solid #800C05',
      boxShadow: '0px 1px 2px rgba(16, 24, 40, 0.05)',
    },
    _disabled: {
      bg: '#FFFFFF',
      border: '1px solid #FCD2CF',
      boxShadow: '0px 1px 2px rgba(16, 24, 40, 0.05)',
    },
  };
  const ghost_error = {
    bg: 'interface.error.500',
    color: 'interface.error.700',
    borderRadius: '4px',
    border: '1px solid #FCEAE8',
    boxShadow: '0px 1px 2px rgba(16, 24, 40, 0.05)',
    _hover: {
      bg: 'interface.error.500',
      border: '1px solid #FCEAE8',
      boxShadow: '0px 1px 2px rgba(16, 24, 40, 0.05), 0px 0px 0px 4px #FEE4E2',
      _disabled: {
        bg: 'rgba(252, 234, 232, 0.5)',
        border: '1px solid rgba(252, 234, 232, 0.5)',
        boxShadow: '0px 1px 2px rgba(16, 24, 40, 0.05)',
      },
    },
    _active: {
      bg: ' rgba(220, 24, 12, 0.15)',
      border: '1px solid #FCEAE8',
      boxShadow: '0px 1px 2px rgba(16, 24, 40, 0.05)',
    },
    _disabled: {
      bg: 'rgba(252, 234, 232, 0.5)',
      border: '1px solid rgba(252, 234, 232, 0.5)',
      boxShadow: '0px 1px 2px rgba(16, 24, 40, 0.05)',
    },
  };
  const solid_close_btn = {
    bg: 'brand.primary.700',
    borderRadius: '4px',
    _hover: {
      _disabled: {
        bg: 'brand.primary.500',
      },
    },
    _disabled: {
      bg: 'transparent',
    },
  };
  const outline_close_btn = {
    color: 'neutrals.600',
    _hover: {
      color: 'neutrals.700',
    },
    _focus: {
      color: 'neutrals.600',
    },
  };
  const ghost_close_btn = {
    bg: 'transparent',
    borderRadius: '4px',
    color: 'brand.primary.700',
    _hover: {
      bg: 'rgba(227, 227, 252, 0.5)',
      color: 'brand.primary.900',
    },
    _focused: {
      bg: 'rgba(227, 227, 252, 0.5)',
      color: 'brand.primary.700',
    },
  };

  ButtonVariantTypes('solid-primary', solid_primary);
  ButtonVariantTypes('outline-primary', outline_primary);
  ButtonVariantTypes('ghost-primary', ghost_primary);
  ButtonVariantTypes('solid-error', solid_error);
  ButtonVariantTypes('outline-error', outline_error);
  ButtonVariantTypes('ghost-error', ghost_error);
  ButtonVariantTypes('solid-close-btn', solid_close_btn);
  ButtonVariantTypes('outline-close-btn', outline_close_btn);
  ButtonVariantTypes('ghost-close-btn', ghost_close_btn);
});
describe('Test button sizes values', () => {
  const ButtonSizeTypes = (size: ButtonSizeTypes, expected: any) => {
    test(`${size} correct style json`, async () => {
      expect(JSON.stringify(buttonSizes[size])).toBe(JSON.stringify(expected));
    });
  };
  const sm = {
    p: '8px 14px',
    fontFamily: 'Helvetica Neue',
    fontWeight: 500,
    fontSize: '12px',
    lineHeight: '12px',
    letterSpacing: '0.02em',
  };
  const md = {
    p: '10px 16px',
    fontFamily: 'Helvetica Neue',
    fontWeight: 500,
    fontSize: '14px',
    lineHeight: '14px',
    letterSpacing: '0.02em',
  };
  const lg = {
    p: '10px 18px',
    fontFamily: 'Helvetica Neue',
    fontWeight: 500,
    fontSize: '18px',
    lineHeight: '24px',
  };
  const xl = {
    p: '12px 20px',
    fontFamily: 'Helvetica Neue',
    fontWeight: 500,
    fontSize: '20px',
    lineHeight: '20px',
  };
  const xl2 = {
    p: '16px 28px',
    fontFamily: 'Helvetica Neue',
    fontWeight: 500,
    fontSize: '18px',
    lineHeight: '24px',
  };
  const button_close_sm = {
    width: '36px',
    height: '36px',
  };
  const button_close_md = {
    width: '40px',
    height: '40px',
  };
  const button_close_lg = {
    width: '44px',
    height: '44px',
  };
  ButtonSizeTypes('sm', sm);
  ButtonSizeTypes('md', md);
  ButtonSizeTypes('lg', lg);
  ButtonSizeTypes('xl', xl);
  ButtonSizeTypes('2xl', xl2);
  ButtonSizeTypes('button-close-sm', button_close_sm);
  ButtonSizeTypes('button-close-md', button_close_md);
  ButtonSizeTypes('button-close-lg', button_close_lg);
});
