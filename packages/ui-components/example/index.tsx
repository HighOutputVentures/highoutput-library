import { ThemeProvider } from '@highoutput/ui-components';
import * as React from 'react';
import 'react-app-polyfill/ie11';
import * as ReactDOM from 'react-dom';

const App = () => {
  return <ThemeProvider></ThemeProvider>;
};

ReactDOM.render(<App />, document.getElementById('root'));
