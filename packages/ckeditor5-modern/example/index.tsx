import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ChakraProvider, extendTheme, Flex, Button } from '@chakra-ui/react';

import { ModernEditor } from './dist';

localStorage.setItem(
  'access_token',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOlswLDE3OSw5OCw4NCwxOCwxMjcsMTA4LDI0OSw1MCwyNDcsOSw0NiwxMDksMjA0LDIzNCw3NV19LCJpYXQiOjE2Mjk0MzY1ODR9.ru0xRz2dN9SEgobwC1YdjCUHKRfBJlvNao7xu3yNdVw'
);

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
          categories={[{ label: 'test', value: 'value' }]}
          mentionables={[]}
          defaultCategory=""
          defaultContent=""
          onSubmit={async v => console.log(v)}
          editorConfig={{
            editorTrigger: <Button>Post</Button>,
          }}
          uploadConfig={{
            apiUrl: 'https://dev-api.identifi.com/upload/policy',
          }}
          onUploadSuccess={(url: string[]) => console.log(url)}
        />
      </Flex>
    </ChakraProvider>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
