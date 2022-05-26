import React from 'react';
import { createRoot } from 'react-dom/client';
import { API } from '@editorjs/editorjs';

import NeyarTextComponent from '../components/NeyarText/NeyarText';
import NeyarTextSVG from '../icons/NeyarTextSvg';

interface NeyarTextData {
  neyarText: string;
}

export default class NeyarText {
  placeholder: string;
  api: API;
  readOnly: boolean;
  data: NeyarTextData;
  nodes: any;

  constructor({ data, config, api, readOnly }: any) {
    this.api = api;
    this.readOnly = readOnly;

    this.placeholder = config.placeholder || '';

    this.nodes = {
      holder: null,
    };

    this.data = {
      neyarText: data.neyarText || '',
    };
  }

  render() {
    const rootNode = document.createElement('div');
    this.nodes.holder = rootNode;

    const root = createRoot(rootNode);
    root.render(<NeyarTextComponent data={this.data.neyarText} />);

    return this.nodes.holder;
  }

  validate(savedData: any) {
    if (savedData.neyarText.trim() === '') {
      return false;
    }

    return true;
  }

  save(blockContent: any) {
    let content = blockContent.querySelector('[contenteditable]');

    return {
      neyarText: content ? content.innerHTML : undefined,
    };
  }

  /**
   * Enable Conversion in Inline Toolbar. NeyarText can be converted to/from other tools
   */
  static get conversionConfig() {
    return {
      export: 'neyarText', // to convert Paragraph to other block, use 'neyarText' property of saved data
      import: 'neyarText', // to covert other block's exported string to Paragraph, fill 'neyarText' property of tool data
    };
  }

  static get sanitize() {
    return {
      neyarText: {
        br: true,
      },
    };
  }

  static get toolbox() {
    return {
      title: 'Neyar Text',
      icon: NeyarTextSVG,
    };
  }

  static get pasteConfig() {
    return {
      tags: ['P'],
    };
  }
}
