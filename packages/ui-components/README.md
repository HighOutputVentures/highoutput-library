### Getting started

We aim to build a library of custom ReactJS components that implements our unique UI design conventions. The ReactJS components will be based primarily on Chakra UI components. React Storybook will be used for documentation and testing.

## Commands

To install package, use:

```bash
npm i @highoutput/ui-components
```

### Usage

```typescript
// React main
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ThemeProvider } from '@highoutput/ui-components';

const App = () => {
  return (<ThemeProvider><div>{...components here}</div></ThemeProvider>);
};

ReactDOM.render(<App />, document.getElementById('root'));
```

```typescript
import { RadioImageGroup } from '@highoutput/ui-components';

export const SamplePage = () => {
  const [value, setValue] = useState('');

  return (
    <>
      <Text>Select Image: {value}</Text>
      <RadioImageGroup
        avatars={[
          {
            value: 'Kat',
            image: 'https://randomuser.me/api/portraits/women/44.jpg',
          },
          {
            value: 'Kevin',
            image: 'https://randomuser.me/api/portraits/men/86.jpg',
          },
          {
            value: 'Andy',
            image: 'https://randomuser.me/api/portraits/men/29.jpg',
          },
          {
            value: 'Jess',
            image: 'https://randomuser.me/api/portraits/women/95.jpg',
          },
        ]}
        onChange={v => setValue(v)}
      />
    </>
  );
};
```

## Other Documented Usage

- [Components Live Preview](https://hov-ui-components-highoutput.vercel.app/)
- [Contact Us Form](https://www.notion.so/highoutput/Contact-us-form-6b4a49c0cbe24891a34d96e1b34b1e6e)

## Contribute

- [document for contributing in this library](https://github.com/HighOutputVentures/experiments/tree/main/016)
