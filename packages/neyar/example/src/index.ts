import { EditorJS, Header, NeyarText, Code, CheckList } from '../../dist';

window.addEventListener('DOMContentLoaded', () => {
  const editor = new EditorJS({
    /**
     * Id of Element that should contain the Editor
     */

    holder: 'editor',
    tools: {
      neyarText: {
        class: NeyarText,
        config: {
          placeholder: `Type '/' for commands`,
          mentions: [
            {
              value: 'ea7e30bf-6c59-4c97-a9b6-618007c3c7d7',
              label: 'John Doe',
              avatar:
                'https://gravatar.com/avatar/a4fa946654baf3309ecf651219c9a247?s=400&d=robohash&r=x',
            },
          ],
        },
      },
      code: Code,
      checklist: CheckList,
      header: {
        class: Header,
        inlineToolbar: true,
      },
    },
    defaultBlock: 'neyarText',

    /**
     * onReady callback
     */
    onReady: () => {},

    /**
     * onChange callback
     */
    onChange: (api, event) => {
      editor.save().then(outputData => {
        console.log(outputData);
      });
    },
  });
});
