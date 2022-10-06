import { extendTheme } from '@chakra-ui/react';
import colors from './color/colors';
import components from './components';
import config from './config';
import fonts from './fonts';
import fontSizes from './fontSizes';
import styles from './styles';
import zIndices from './zIndices';

const theme = extendTheme({
  config,
  styles,
  colors,
  fonts,
  fontSizes,
  components,
  zIndices,
});

export default theme;
