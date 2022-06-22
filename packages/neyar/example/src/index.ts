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
      /**HOV Tool */
      neyarText: {
        class: NeyarText,
        inlineToolbar: true,
        config: {
          mentions: [
            {
              value: '29856d46-50c5-4a0b-b1e2-b965d7c67b8d',
              label: 'Edward Kenway',
              avatar: null,
            },
            {
              value: '29856d46-50c5-4a0b-b1e2-b965d7c67b8a',
              label: 'John Connor Kenway',
              avatar:
                'https://play-lh.googleusercontent.com/ZvMvaLTdYMrD6U1B3wPKL6siMYG8nSTEnzhLiMsH7QHwQXs3ZzSZuYh3_PTxoU5nKqU',
            },
          ],
        },
      },

      // paragraph: false as any,
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

      /** Inline tools */
      marker: Marker,
      inlineCode: InlineCode,
      linkAutocomplete: LinkAutocomplete,
      underline: Underline,
    },
    defaultBlock: 'neyarText',
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
