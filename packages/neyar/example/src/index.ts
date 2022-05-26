import {
  EditorJS,

  /** EditorJS block tools */
  Header,
  Code,
  CheckList,
  Qoute,
  Delimiter,
  ToggleBlock,
  List,
  ImageTool,
  SimpleImage,
  Link,
  Embed,
  Table,
  Attaches,
  Raw,
  NestedList,

  /** Hov block tools */
  NeyarText,

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
} from '../../dist';

window.addEventListener('DOMContentLoaded', () => {
  const editor = new EditorJS({
    holder: 'editor',
    inlineToolbar: true,
    tools: {
      code: Code,
      checklist: CheckList,
      header: { class: Header, inlineToolbar: true },
      list: { class: List, inlineToolbar: true },
      toggleBlock: ToggleBlock,
      delimiter: Delimiter,
      qoute: Qoute,
      image: ImageTool,
      simpleImage: SimpleImage,
      link: Link,
      embed: Embed,
      table: Table,
      attaches: Attaches,
      raw: Raw,
      nestedList: NestedList,

      /**HOV Tool */
      neyarText: { class: NeyarText, inlineToolbar: true },

      /** Inline tools */
      marker: Marker,
      inlineCode: InlineCode,
      linkAutocomplete: LinkAutocomplete,
      underline: Underline,
    },
    onReady: () => {
      new DragDrop(editor);
      new Undo(editor);
    },
    onChange: (api, event) => {
      // editor.save().then(outputData => {
      //   console.log(outputData);
      // });
    },
  });
});
