import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { HOVEditor, EditorTypes } from '../.';

const App = () => {
  return (
    <div>
      <HOVEditor
        value=""
        onChange={(v) => console.log(v)}
        placeholder="Editor library"
        editorType={EditorTypes.CHECK_IN}
      />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
