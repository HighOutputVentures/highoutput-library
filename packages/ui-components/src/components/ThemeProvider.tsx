import { ChakraProvider, ChakraProviderProps } from '@chakra-ui/react';
import React, { FC } from 'react';

import '../Fonts/fonts.css';
import { extendTheme } from '../utils/theme.utils';

export interface ThemeProviderProps extends ChakraProviderProps {}

const ThemeProvider: FC<ThemeProviderProps> = ({ children, ...props }) => {
  return (
    <ChakraProvider {...props} theme={extendTheme(props.theme)}>
      {children}
    </ChakraProvider>
  );
};

export default ThemeProvider;
