import {
  ChakraProvider,
  ChakraProviderProps,
  extendTheme,
} from '@chakra-ui/react';
import React, { FC } from 'react';
import defaultTheme from '../theme';

export interface ThemeProviderProps extends ChakraProviderProps {}

const ThemeProvider: FC<ThemeProviderProps> = ({
  theme,
  children,
  ...props
}) => {
  return (
    <ChakraProvider
      theme={extendTheme({ ...defaultTheme, ...theme })}
      {...props}
    >
      {children}
    </ChakraProvider>
  );
};

export default ThemeProvider;
