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
          bg: 'primary.500',
        },
      },
    },

    secondary: {
      track: {
        _checked: {
          bg: 'secondary.500',
        },
      },
    },

    orange: {
      track: {
        _checked: {
          bg: 'orange.500',
        },
      },
    },
  },
  defaultProps: {
    variant: 'primary',
  },
};

export default Switch;
