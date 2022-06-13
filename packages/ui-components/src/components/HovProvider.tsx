import React, { FC, ReactNode } from 'react';
import { ChakraProvider, ChakraProviderProps } from '@chakra-ui/react';

interface HovProviderProps extends ChakraProviderProps {
  children: ReactNode;
}

const HovProvider: FC<HovProviderProps> = props => {
  const { children, theme } = props;
  return (
    <ChakraProvider {...props} theme={theme}>
      {children}
    </ChakraProvider>
  );
};

export default HovProvider;
