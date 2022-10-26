export const PinInputField = {
  baseStyle: () => ({
    size: {
      sm: {
        h: '64px',
        w: '64px',
        fontSize: 'sm',
        borderRadius: 'sm',
      },
      md: {
        h: '80px',
        w: '80px',
        fontSize: 'md',
        borderRadius: 'md',
      },
      lg: {
        h: '96px',
        w: '96px',
        fontSize: 'lg',
        borderRadius: 'lg',
      },
    },
  }),
  variants: {
    outline: {
      borderColor: 'neutrals.500',
      border: '1px solid',
      bgColor: 'alpha.white.500',
      boxShadow: '0px 1px 2px rgba(16, 24, 40, 0.05)',
      borderRadius: '8px',
      fontSize: 'headers-mobile-1',
      _placeholder: {
        color: 'neutrals.500',
      },
    },
    flushed: {
      borderColor: 'neutrals.500',
      borderBottom: '1px solid',
      bgColor: 'alpha.white.500',
      boxShadow: '0px 1px 2px rgba(16, 24, 40, 0.05)',
      borderRadius: '8px',
      fontSize: 'headers-mobile-1',
      _placeholder: {
        color: 'neutrals.500',
      },
    },
  },
  defaultProps: {
    size: 'sm',
    variant: 'outline',
  },
};

export default PinInputField;
