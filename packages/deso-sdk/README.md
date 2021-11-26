# DeSo SDK

A wrapper to DeSo Identity and API endpoints. This expirement aims to make the DeSo transactions quick and easy for devs to integrate to the frontend side of the web systems development.

## Installation

Install the package with npm

```bash
  npm install @glevinzon/deso-sdk --save
```

or if you are using yarn

```bash
  yarn add @glevinzon/deso-sdk --save
```

## Usage/Examples

Wrap the components to the Context provider

```javascript
import { DesoProvider } from '@glevinzon/deso-sdk';

function App() {
  return (
    <DesoProvider>
      <Component {...pageProps} />
    </DesoProvider>
  );
}
```

import and use the exposed hook `useDesoContextValues` to get methods you can use

```javascript
import { useDesoContextValues } from '@glevinzon/deso-sdk';

const LoginForm: React.FC = () => {
  const { getIdentity } = useDesoContextValues();

  return (
    <Button
      onClick={async () => {
        await getIdentity(data => {
          const { pubKey, token } = data; // pubkey and token are returned
          void connectBitclout({
            variables: {
              input: {
                publicKey: pubKey,
                jwt: token,
              },
            },
          }); // custom method
        });
      }}
    >
      <IconBitclout />
      <Text>Log in using Bitclout</Text>
    </Button>
  );
};
```

## Roadmap

- Expose reactjs' Context for ease of use on reactjs projects

- Implement use of DeSo Identity for login and signup purposes

- Implement send-deso transaction flow

- Implement submit-post transaction flow

- Add methods for endpoints on simple fetching of data
