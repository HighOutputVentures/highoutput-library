import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ChakraProvider, extendTheme, Flex, Button } from '@chakra-ui/react';

import { ModernEditor, ImageGrid } from '../dist';

// note this is for testing purposes only
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
      <Flex maxW="645px" mx="auto" p="4">
        <ModernEditor
          mentionables={[]}
          defaultContent=""
          defaultImages={[]}
          onSubmit={async v => console.log(v)}
          editorConfig={{
            placeholder: 'Write something here...',
            cancelBtn: {
              text: 'Cancel',
            },
          }}
          uploadConfig={{
            apiUrl: 'https://dev-api.identifi.com/upload/policy',
          }}
        />
      </Flex>

      <ImageGrid
        images={[
          'https://cdn.pixabay.com/photo/2019/10/19/12/22/hot-air-balloon-4561273_1280.jpg',
          'https://cdn.pixabay.com/photo/2019/10/19/12/22/hot-air-balloon-4561273_1280.jpg',
          'https://cdn.pixabay.com/photo/2019/10/19/12/22/hot-air-balloon-4561273_1280.jpg',
          'https://cdn.pixabay.com/photo/2019/10/19/12/22/hot-air-balloon-4561273_1280.jpg',
          'https://cdn.pixabay.com/photo/2019/10/19/12/22/hot-air-balloon-4561273_1280.jpg',
          'https://cdn.pixabay.com/photo/2019/10/19/12/22/hot-air-balloon-4561273_1280.jpg',
        ]}
        withoutBorderRadius
        noCloseButton
        maxHeight={300}
      />
    </ChakraProvider>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
