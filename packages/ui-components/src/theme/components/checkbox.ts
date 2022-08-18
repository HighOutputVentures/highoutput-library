export const Checkbox = {
  baseStyle: {
    control: {
      borderRadius: 'base',
      padding: '6px',
    },
  },
  variants: {
    primary: {
      control: {
        borderColor: 'gray.200',
        pointerEvents: 'none',
        _focus: { shadow: 'none' },
        _checked: {
          bg: 'primary.500',
          color: 'primary.500',
          borderColor: 'primary.500',
          _hover: {
            bg: 'primary.500',
            color: 'primary.500',
            borderColor: 'primary.500',
          },
        },
      },
    },
    orange: {
      control: {
        borderColor: 'gray.200',
        _focus: { shadow: 'none' },
        _checked: {
          bg: 'orange.500',
          color: 'white',
          borderColor: 'orange.500',
          _hover: {
            bg: 'orange.500',
            color: 'white',
            borderColor: 'orange.500',
          },
        },
      },
    },
  },
  defaultProps: {
    variant: 'primary',
  },
};

export default Checkbox;
