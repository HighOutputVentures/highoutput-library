import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ChakraProvider, extendTheme, Flex, Button } from '@chakra-ui/react';

import { ModernEditor } from '../.';

const theme = extendTheme({
  styles: {
    global: {
      'html, body': {
        '.ck .ck-balloon-panel': {
          zIndex: 9999,
        },
      },
    },
  },
});

const App = () => {
  return (
    <ChakraProvider theme={theme}>
      <Flex maxW="550px" mx="auto" p="4">
        <ModernEditor
          categories={[]}
          mentionables={[]}
          defaultCategory=""
          defaultContent=""
          editorTrigger={<Button>Largs x Jac</Button>}
        />
      </Flex>
    </ChakraProvider>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
