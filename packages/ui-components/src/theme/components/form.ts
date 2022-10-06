import { sizeText } from './text/text';

export const Form = {
  parts: ['formLabel', 'formInput', 'formTextarea'],
  baseStyle: {
    formLabel: {
      fontWeight: 500,
      fontSize: '16px',
      lineHeight: '19px',
    },
    formInput: {
      fontWeight: 'normal',
      fontSize: '16px',
      lineHeight: '19px',
      border: '1px solid',
      borderColor: 'gray.100',
      borderRadius: 'base',
      _placeholder: {
        color: 'gray.400',
      },
      padding: 2,
    },
    formTextarea: {
      fontWeight: 'normal',
      fontSize: '16px',
      lineHeight: '19px',
      border: '1px solid',
      borderColor: 'gray.100',
      borderRadius: 'base',
      _placeholder: {
        color: 'gray.400',
      },
      padding: 2,
    },
  },
  sizes: {
    formLabel: sizeText,
  },
  variants: {
    primary: {
      formInput: {
        _focus: { border: '2px solid', borderColor: 'brand.primary.700' },
        _invalid: { _focus: { border: '2px solid', borderColor: 'red.500' } },
        fontSize: '14px',
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
