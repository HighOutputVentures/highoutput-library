import NeyarTextSVG from '../../icons/NeyarTextSvg';

class NeyarText {
  _element: HTMLElement;
  _placeholder: string;
  _api: any;
  data: any;
  readOnly: boolean;
  _CSS: any;

  constructor({ data, config, api, readOnly }: any) {
    this._api = api;
    this.readOnly = readOnly;

    this._CSS = {
      block: this._api.styles.block,
      wrapper: 'ce-paragraph',
    };

    this._placeholder = config.placeholder ? config.placeholder : '';
    this._element = this.drawView();

    this._api.listeners.on(
      this._element,
      'keyup',
      (e: KeyboardEvent) => {
        this.onKeyUp(e, this._api);
      },
      false
    );

    this.data = data;
  }

  openToolbar() {
    this._api.toolbar.open();
  }

  onKeyUp(e: any, apiTest: any) {
    if (e.code === 'Slash') {
      console.log(e);
      apiTest.toolbar.open();
    }
  }

  drawView() {
    let div = document.createElement('div');

    div.classList.add(this._CSS.wrapper, this._CSS.block);
    div.contentEditable = 'true';
    div.dataset.placeholder = this._api.i18n.t(this._placeholder);

    return div;
  }

  render() {
    return this._element;
  }

  save(blockContent: any) {
    return {
      neyarText: blockContent.innerHTML,
    };
  }

  static get toolbox() {
    return {
      title: 'Neyar Text',
      icon: NeyarTextSVG,
    };
  }
}

export default NeyarText;
