import { sizeText } from './text'

export const Link = {
  baseStyle: {
    _hover: {
      textDecoration: 'underline',
    },
  },
  sizes: sizeText,
  variants: {
    primary: {
      fontWeight: 'medium',
      color: 'sunglow.500',
    },
    orange: {
      fontWeight: 'medium',
      color: 'orange.500',
    },
  },
}

export default Link
