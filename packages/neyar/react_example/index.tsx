import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { ReactNeyarEditorClient } from '../dist';

const App: React.FC = () => {
  return (
    <div>
      test
      <ReactNeyarEditorClient />
    </div>
  );
};

const rootNode = document.getElementById('root');

const root = ReactDOM.createRoot(rootNode!);
root.render(<App />);
