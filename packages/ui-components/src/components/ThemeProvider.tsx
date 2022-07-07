import { ChakraProvider, ChakraProviderProps } from '@chakra-ui/react';
import React, { FC } from 'react';
import defaultTheme from '../theme';

export interface ThemeProviderProps extends ChakraProviderProps {}

const ThemeProvider: FC<ThemeProviderProps> = ({
  theme,
  children,
  ...props
}) => {
  return (
    <ChakraProvider theme={defaultTheme} {...props}>
      {children}
    </ChakraProvider>
  );
};

export default ThemeProvider;
