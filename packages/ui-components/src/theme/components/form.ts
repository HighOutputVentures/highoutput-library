import { sizeText } from './text/text';

export const Form = {
  parts: ['formLabel', 'formInput', 'formTextarea', 'formHelperText'],
  baseStyle: {
    formLabel: {
      fontWeight: 500,
      fontSize: 'labels-xs-medium',
      lineHeight: '14px',
      letterSpacing: '0.02em',
      color: 'neutrals.900',
    },
    formInput: {
      fontWeight: 'normal',
      fontSize: 'paragraphs-sm-default',
      lineHeight: '24px',
      border: '1px solid',
      height: '44px',
      bgColor: 'alpha.white.500',
      borderColor: 'neutrals.200',
      padding: '8px 14px',
      borderRadius: 'base',
      _placeholder: {
        color: 'neutrals.500',
      },
    },
    formTextarea: {
      fontWeight: 'normal',
      fontSize: 'paragraph-sm-default',
      boxShadow: '0px 1px 2px rgba(16, 24, 40, 0.05)',
      border: '1px solid',
      borderColor: 'neutrals.300',
      color: 'neutrals.900',
      letterSpacing: '0.02em',
      borderRadius: '8px',
      _invalid: {
        border: '1px solid',
        borderColor: 'interface.error.700',
        _focus: { borderColor: 'interface.error.700', border: '1px solid' },
      },
      _placeholder: {
        color: 'neutrals.500',
      },
      padding: '14px 10px',
    },
    formHelperText: {
      fontSize: 'labels-xs-default',
      fontWeight: 400,
      mt: '6px',
      _invalid: { color: 'interface.error.700' },
      color: 'neutrals.700',
      letterSpacing: '0.02em',
    },
  },
  sizes: {
    formLabel: sizeText,
  },
  variants: {
    primary: {
      formInput: {
        _focus: { border: '1px solid', borderColor: 'brand.primary.700' },
        _invalid: {
          border: '1px solid',
          borderColor: 'interface.error.700',
          _focus: { border: '1px solid', borderColor: 'interface.error.700' },
        },
        fontSize: 'paragraph-sm-default',
        height: '44px',
        boxShadow: '0px 1px 2px rgba(16, 24, 40, 0.05)',
        borderRadius: '8px',
        fontWeight: 'normal',
        letterSpacing: '0.02em',
        _disabled: {
          bgColor: 'neutrals.100',
          borderColor: 'neutrals.200',
        },
      },
      formTextarea: {
        mt: '6px',
        _invalid: {
          border: '1px solid',
          borderColor: 'interface.error.700',
          _focus: { borderColor: 'interface.error.700', border: '1px solid' },
        },
        fontSize: 'paragraph-sm-default',
        boxShadow: '0px 1px 2px rgba(16, 24, 40, 0.05)',
        border: '1px solid',
        borderColor: 'neutrals.300',
        color: 'neutrals.900',
        letterSpacing: '0.02em',
        borderRadius: '8px',
        _placeholder: {
          color: 'neutrals.500',
        },
        padding: '14px 10px',
      },
    },
    'check-in-edit': {
      formInput: {
        height: '34px',
        _focus: { border: '2px solid', borderColor: 'brand.primary.700' },
        _invalid: { _focus: { border: '2px solid', borderColor: 'red.500' } },
      },
      formTextarea: {
        _focusVisible: {
          border: '2px solid',
          borderColor: 'brand.primary.700',
        },
        _invalid: {
          _focusVisible: { border: '2px solid', borderColor: 'red.500' },
        },
        fontSize: '14px',
      },
    },
    'check-in': {
      formInput: {
        border: 'none',
        _focus: {
          border: '2px solid !important',
          borderColor: '#FFC107 !important',
        },
        _hover: { border: '1px dashed', borderColor: 'gray.400' },
      },
      formTextarea: {
        _focusVisible: {
          border: '2px solid',
          borderColor: 'brand.primary.700',
        },
        _invalid: {
          _focusVisible: { border: '2px solid', borderColor: 'red.500' },
        },
        fontSize: '14px',
      },
    },
  },
  defaultProps: {
    variant: 'primary',
  },
};

export default Form;
