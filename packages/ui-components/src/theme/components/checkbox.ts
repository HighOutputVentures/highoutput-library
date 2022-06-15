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
          bg: 'sunglow.500',
          color: 'amberDark.500',
          borderColor: 'sunglow.500',
          _hover: {
            bg: 'amber.500',
            color: 'amberDark.500',
            borderColor: 'amber.500',
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
}

export default Checkbox
