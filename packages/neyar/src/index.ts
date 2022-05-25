import EditorJS from '@editorjs/editorjs';

/** Editor.js Plugin */
import Header from '@editorjs/header';
import Code from '@editorjs/code';
import Paragraph from '@editorjs/paragraph';
import CheckList from '@editorjs/checklist';
import Qoute from '@editorjs/quote';
import Delimiter from '@editorjs/delimiter';
import ToggleBlock from 'editorjs-toggle-block';
import List from '@editorjs/list';
import NestedList from '@editorjs/nested-list';
import ImageTool from '@editorjs/image';
import SimpleImage from '@editorjs/simple-image';
import Link from '@editorjs/link';
import Attaches from '@editorjs/attaches';
import Embed from '@editorjs/embed';
import Table from '@editorjs/table';
import Raw from '@editorjs/raw';

export {
  EditorJS,
  Header,
  Code,
  Paragraph, // default text block
  Qoute,
  Delimiter,
  ToggleBlock,
  List,
  NestedList,
  CheckList,
  ImageTool,
  SimpleImage,
  Link, // link with preview
  Attaches,
  Embed,
  Table,
  Raw,
};

/** HOV Custom Plugin */
import NeyarText from './class/blockTool/NeyarText';

export { NeyarText };

/** Other Library */
import DragDrop from 'editorjs-drag-drop';
import Undo from 'editorjs-undo';

export { DragDrop, Undo };

/** Editor.js Inline Tools */
import Marker from '@editorjs/marker';
import InlineCode from '@editorjs/inline-code';
import Underline from '@editorjs/underline';
import LinkAutocomplete from '@editorjs/link-autocomplete';

export { Marker, InlineCode, Underline, LinkAutocomplete };

/** Editor.js block tune tool */
import AlignmentTuneTool from 'editorjs-text-alignment-blocktune';

export { AlignmentTuneTool };
