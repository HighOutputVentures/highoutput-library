import React, { FC, ReactNode } from 'react';
import {
  ChakraProvider,
  ChakraProviderProps,
  extendTheme,
} from '@chakra-ui/react';

import hovTheme from '../theme';

interface HovProviderProps extends ChakraProviderProps {
  children: ReactNode;
}

const HovProvider: FC<HovProviderProps> = props => {
  const { children, theme } = props;
  return (
    <ChakraProvider {...props} theme={extendTheme({ ...hovTheme, ...theme })}>
      {children}
    </ChakraProvider>
  );
};

export default HovProvider;
