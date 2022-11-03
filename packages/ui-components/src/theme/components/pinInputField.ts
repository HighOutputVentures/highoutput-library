export const PinInputField = {
  baseStyle: {
    _placeholder: {
      color: 'neutrals.500',
    },
    fontSize: '44px',

    _focusVisible: {
      outline: 'none',
      borderColor: 'brand.primary.500',
    },
    border: '1px solid',
    bgColor: 'alpha.white.500',
    textAlign: 'center',
    borderColor: 'brand.primary.500',
    color: 'brand.primary.700',
  },
  sizes: {
    sm: {
      h: '64px',
      w: '64px',
      borderRadius: 'sm',
    },
    md: {
      h: '80px',
      w: '80px',
      borderRadius: 'md',
    },
    lg: {
      h: '96px',
      w: '96px',
      borderRadius: 'lg',
    },
  },
  variants: {
    outline: {
      boxShadow: '0px 1px 2px rgba(16, 24, 40, 0.05)',
      borderRadius: '8px',
      _focus: {
        borderColor: 'brand.primary.500',
        caretColor: 'black',
        boxShadow:
          '0px 4px 8px -2px rgba(16, 24, 40, 0.1), 0px 2px 4px -2px rgba(16, 24, 40, 0.06)',
      },
    },
    flushed: {
      boxShadow: '0px 1px 2px rgba(16, 24, 40, 0.05)',
      border: '0px',
      borderRadius: '0px',
      borderBottom: '1px solid',
      borderBottomColor: 'brand.primary.500',
      _focus: {
        borderColor: 'brand.primary.500',
        caretColor: 'black',
        boxShadow:
          '0px 4px 8px -2px rgba(16, 24, 40, 0.1), 0px 2px 4px -2px rgba(16, 24, 40, 0.06)',
      },
    },
    filled: {
      boxShadow: '0px 1px 2px rgba(16, 24, 40, 0.05)',
      borderRadius: '8px',
      _focus: {
        borderColor: 'brand.primary.500',
        caretColor: 'black',
        bgColor: 'alpha.white.500',
        boxShadow:
          '0px 4px 8px -2px rgba(16, 24, 40, 0.1), 0px 2px 4px -2px rgba(16, 24, 40, 0.06)',
      },

      bgColor: 'brand.primary.500',
    },
    unstyled: {
      bgColor: 'transparent',
      border: '0px',
      _focus: {
        caretColor: 'black',
      },
    },
  },
  defaultProps: {
    size: 'sm',
    variant: 'outline',
  },
};

export default PinInputField;
