import {
  EditorJS,
  Header,
  Code,
  CheckList,
  List,
  ImageTool,
  Embed,
  Table,
  Raw,
  NeyarText,
  Undo,
  DragDrop,
  Marker,
  InlineCode,
  LinkAutocomplete,
  Underline,
} from '../../dist';

window.addEventListener('DOMContentLoaded', () => {
  const editor = new EditorJS({
    holder: 'editor',
    inlineToolbar: true,
    tools: {
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
      header: Header,
      checklist: CheckList,
      list: List,
      embed: Embed,
      table: Table,
      code: Code,
      raw: Raw,
      image: ImageTool,
      marker: Marker,
      inlineCode: InlineCode,
      linkAutocomplete: LinkAutocomplete,
      underline: Underline,
      paragraph: false as any,
    },
    defaultBlock: 'neyarText',
    onReady: () => {
      new DragDrop(editor);
      new Undo(editor);
    },
  });
});
