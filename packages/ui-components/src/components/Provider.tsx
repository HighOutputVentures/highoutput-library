import React, { FC, ReactNode } from 'react';
import {
  ChakraProvider,
  ChakraProviderProps,
  extendTheme,
} from '@chakra-ui/react';

import defaultTheme from '../theme';

interface ThemeProviderProps extends ChakraProviderProps {
  children: ReactNode;
}

const ThemeProvider: FC<ThemeProviderProps> = props => {
  const { children, theme } = props;
  return (
    <ChakraProvider
      {...props}
      theme={extendTheme({ ...defaultTheme, ...theme })}
    >
      {children}
    </ChakraProvider>
  );
};

export default ThemeProvider;
