export const Switch = {
  baseStyle: {
    track: {
      _focus: { boxShadow: 'none' },
    },
  },
  variants: {
    primary: {
      track: {
        _checked: {
          bg: 'brand.primary.700',
        },
      },
    },
  },
  defaultProps: {
    variant: 'primary',
  },
};

export default Switch;
