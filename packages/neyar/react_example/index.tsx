import * as React from 'react';
import * as ReactDOM from 'react-dom/client';

const App: React.FC = () => {
  return <div>test</div>;
};

const rootNode = document.getElementById('root');

const root = ReactDOM.createRoot(rootNode!);
root.render(<App />);
