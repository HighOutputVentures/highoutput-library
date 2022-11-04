import { sizeText } from './text/text';

export const Form = {
  parts: [
    'formLabel',
    'formInput',
    'formTextarea',
    'formHelperText',
    'formErrorMessage',
  ],
  baseStyle: {
    formLabel: {
      size: 'label-xs-medium',
      color: 'neutrals.900',
    },
    formInput: {
      size: 'paragraph-sm-default',
      padding: '8px 14px',
      _placeholder: {
        color: 'neutrals.500',
      },
      _focus: { border: '1px solid', borderColor: 'brand.primary.700' },
      _focusVisible: {
        outline: 'none',
      },
      _hover: { border: '1px solid', borderColor: 'brand.primary.700' },
      _disabled: {
        bgColor: 'neutrals.100',
        borderColor: 'neutrals.200',
      },
      border: '1px solid',
      borderColor: 'neutrals.200',
    },
    formTextarea: {
      size: 'paragraph-sm-default',
      _placeholder: {
        color: 'neutrals.500',
      },
      _hover: { border: '1px solid', borderColor: 'brand.primary.700' },
      padding: '14px 10px',
      _focus: { border: '1px solid', borderColor: 'brand.primary.700' },
      _focusVisible: {
        outline: 'none',
      },
    },
    formHelperText: {
      size: 'label-xs-default',
      mt: '6px',
      color: 'neutrals.700',
    },
    formErrorMessage: {
      size: 'label-xs-default',
      mt: '6px',
      color: 'interface.error.700',
    },
  },
  sizes: {
    formLabel: sizeText,
  },
  variants: {
    outline: {
      formInput: {
        height: '44px',
        bgColor: 'alpha.white.500',
        borderColor: 'neutrals.200',
        border: '1px solid',
        _focus: { border: '1px solid', borderColor: 'brand.primary.700' },
        _focusVisible: {
          outline: 'none',
        },
        boxShadow: '0px 1px 2px rgba(16, 24, 40, 0.05)',
        borderRadius: '8px',
        color: 'neutrals.900',
        _invalid: {
          border: '1px solid',
          borderColor: 'interface.error.700',
          _focus: { border: '1px solid', borderColor: 'interface.error.700' },
        },
      },
      formTextarea: {
        mt: '6px',
        size: 'paragraph-sm-default',
        boxShadow: '0px 1px 2px rgba(16, 24, 40, 0.05)',
        border: '1px solid',
        borderColor: 'neutrals.300',
        color: 'neutrals.900',
        borderRadius: '8px',
        _focus: { border: '1px solid', borderColor: 'brand.primary.700' },
        _focusVisible: {
          outline: 'none',
        },
        _invalid: {
          border: '1px solid',
          borderColor: 'interface.error.700',
          _focus: { borderColor: 'interface.error.700', border: '1px solid' },
        },
      },
    },
    flushed: {
      formInput: {
        height: '44px',
        bgColor: 'alpha.white.500',
        borderBottomColor: 'neutrals.200',
        borderBottom: '1px solid',
        _focus: {
          borderBottom: '1px solid',
          borderBottomColor: 'brand.primary.700',
        },
        borderRadius: '0px',
        color: 'neutrals.900',
        _invalid: {
          borderBottom: '1px solid',
          borderBottomColor: 'interface.error.700',
          _focus: {
            borderBottom: '1px solid',
            borderBottomColor: 'interface.error.700',
          },
        },
      },
      formTextarea: {
        mt: '6px',
        size: 'paragraph-sm-default',
        borderBottom: '1px solid',
        borderBottomColor: 'neutrals.300',
        color: 'neutrals.900',
        borderRadius: '0px',
        _invalid: {
          borderBottom: '1px solid',
          borderBottomColor: 'interface.error.700',
          _focus: {
            borderBottomColor: 'interface.error.700',
            borderBottom: '1px solid',
          },
        },
      },
    },
    filled: {
      formInput: {
        height: '44px',
        bgColor: 'brand.primary.500',
        _focus: {
          bgColor: 'transparent',
        },
        borderRadius: '8px',
        color: 'neutrals.900',
        _invalid: {
          border: '1px solid',
          borderColor: 'interface.error.700',
          _focus: {
            border: '1px solid',
            borderColor: 'interface.error.700',
          },
        },
      },
      formTextarea: {
        mt: '6px',
        color: 'neutrals.900',
        borderRadius: '8px',
        bgColor: 'brand.primary.500',
        _focus: {
          bgColor: 'transparent',
        },
        _invalid: {
          borderBottom: '1px solid',
          borderBottomColor: 'interface.error.700',
          _focus: {
            borderBottomColor: 'interface.error.700',
            borderBottom: '1px solid',
          },
        },
      },
    },
    unstyled: {
      formInput: {
        height: '44px',
        bgColor: 'transparent',
        border: '0px',
        color: 'neutrals.900',
        _invalid: {
          border: '1px solid',
          borderColor: 'interface.error.700',
          _focus: {
            border: '1px solid',
            borderColor: 'interface.error.700',
          },
        },
      },
      formTextarea: {
        mt: '6px',
        color: 'neutrals.900',
        bgColor: 'transparent',
        border: '0px',
        _invalid: {
          borderBottom: '1px solid',
          borderBottomColor: 'interface.error.700',
          _focus: {
            borderBottomColor: 'interface.error.700',
            borderBottom: '1px solid',
          },
        },
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
    variant: 'outline',
  },
};

export default Form;
