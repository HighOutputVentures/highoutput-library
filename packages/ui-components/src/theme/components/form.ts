import { sizeText } from './text'

export const Form = {
  parts: ['formLabel', 'formInput'],
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
    },
  },
  sizes: {
    formLabel: sizeText,
  },
  variants: {
    primary: {
      formInput: {
        _focus: { border: '2px solid', borderColor: 'amber.500' },
        _invalid: { _focus: { border: '2px solid', borderColor: 'red.500' } },
        fontSize: '14px',
      },
      formInput1: {
        _focus: { border: '2px solid', borderColor: 'amber.500' },
        _invalid: { _focus: { border: '2px solid', borderColor: 'red.500' } },
        fontSize: '14px',
        color: 'gray.900',
      },
    },

    'check-in-edit': {
      formInput: {
        height: '34px',
        _focus: { border: '2px solid', borderColor: 'amber.500' },
        _invalid: { _focus: { border: '2px solid', borderColor: 'red.500' } },
      },
    },

    'check-in': {
      formInput: {
        border: 'none',
        _focus: { border: '2px solid !important', borderColor: '#FFC107 !important' },
        _hover: { border: '1px dashed', borderColor: 'gray.400' },
      },
    },
  },
  defaultProps: {
    variant: 'primary',
  },
}

export default Form
