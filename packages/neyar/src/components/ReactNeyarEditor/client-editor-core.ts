import EditorJS, { OutputData } from '@editorjs/editorjs';
import NeyarText from '../NeyarText/NeyarText';
import { EditorConfigCoreFactory, EditorCore } from './';

export class ClientEditorCore implements EditorCore {
  private _editorJS: EditorJS;

  constructor({ tools, mentions, ...config }: EditorConfigCoreFactory) {
    const extendTools = {
      neyarText: {
        class: NeyarText,
        inlineToolbar: true,
        config: {
          mentions: mentions,
        },
      },
      paragraph: false as any,
      ...tools,
    };

    this._editorJS = new EditorJS({
      tools: extendTools as any,
      defaultBlock: 'neyarText',
      ...config,
    });
  }

  public async clear() {
    await this._editorJS.clear();
  }

  public async save() {
    return this._editorJS.save();
  }

  public async destroy() {
    await this._editorJS.isReady;
    await this._editorJS.destroy();
  }

  public async render(data: OutputData) {
    await this._editorJS.render(data);
  }
}
