import { extendTheme, ThemeConfig } from '@chakra-ui/react'

import { colors } from './color'
import { zIndices } from './zindex'
import {
  Heading,
  Box,
  Link,
  Button,
  Form,
  Checkbox,
  Switch,
  Tabs,
  Flex,
  Stack,
  Text,
  Drawer,
  Select,
} from './components'

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
}

const theme = extendTheme({
  config,
  styles: {
    global: {
      body: {
        background: '#fcfcfc',
      },
    },
  },
  colors: colors,
  zIndices,
  fonts: {
    heading: 'Inter',
    body: 'Inter',
  },
  components: {
    Button,
    Form,
    Heading,
    Link,
    Checkbox,
    Switch,
    Tabs,
    Flex,
    Stack,
    Box,
    Text,
    Drawer,
    Select,
  },
})

export default theme
