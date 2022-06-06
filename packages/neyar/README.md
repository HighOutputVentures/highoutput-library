### Getting started

We are aiming to create an customizable editor plugin (notion like usage) to integrate mainly in [identifi](https://app.identifi.com/) or other projects; can also adapt to any new feature plugin product team may want to insert; to resolve formatting text concern and to ease building a document type of page. Build around [editor-js](https://editorjs.io/base-concepts)

## Commands

To install package, use:

```bash
npm i @highoutput/neyar
```

### Usage

```html
<div id="editor"></div>
```

```typescript
// typescript usage
import {
  EditorJS,
  NeyarText,

  /** Plugins */
  Undo,
  DragDrop,
} from '@hightoutput/neyar';

const editor = new EditorJS({
  /**
   * Id of Element that should contain the Editor
   */
  holder: 'editor',
  tools: {
    neyarText: {
      class: NeyarText,
    },
  },
  defaultBlock: 'neyarText',
  /**
   * onReady callback
   */
  onReady: () => {
    new DragDrop(editor); // to enable drag and drop of blocks
    new Undo(editor); // to enable undo of blocks
  },
  /**
   * onChange callback
   */
  onChange: (api, event) => {
    editor.save().then(outputData => {
      console.log(outputData); // get serialize data
    });
  },
});
```

### Plugin from Editor.js that we can use

```typescript
// main import
import { EditorJS } from '@hightoutput/neyar';

// plugin from editor js

import {
  Paragraph, // default text block
  Header,
  Code,
  CheckList,
  Qoute,
  Delimiter,
  ToggleBlock,
  List,
  NestedList,
  ImageTool,
  SimpleImage,
  Link, // link with preview
  Attaches,
  Embed,
  Table,
  Raw,

  /** Plugins */
  Undo,
  DragDrop,

  /** Inline tool */
  Marker,
  InlineCode,
  LinkAutocomplete,
  Underline,

  /** Block tune tool */
  AlignmentTuneTool,
} from '@hightoutput/neyar';
```
