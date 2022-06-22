import React from 'react';
import { createRoot } from 'react-dom/client';
import { API, ToolConfig } from '@editorjs/editorjs';

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
  config: ToolConfig;

  constructor({ data, config, api, readOnly }: any) {
    this.api = api;
    this.readOnly = readOnly;
    this.config = config;

    this.placeholder = config.placeholder || '';

    this.nodes = {
      holder: null,
    };

    this.data = {
      neyarText: data.neyarText || '',
    };
  }

  /**
   * neyar text block is rendered here
   */
  render() {
    const rootNode = document.createElement('div');
    this.nodes.holder = rootNode;

    const root = createRoot(rootNode); // create a react dom with the created div element

    root.render(
      <NeyarTextComponent
        data={this.data.neyarText}
        blockIndex={this.api.blocks.getCurrentBlockIndex() + 1}
        mentions={this.config.mentions || []}
      />
    ); // render react component in from the create react dom

    return this.nodes.holder || ''; // return component rendered
  }

  /**
   * saves data after editing
   */
  save(blockContent: any) {
    let content = blockContent.querySelector('[contenteditable]');

    return {
      neyarText: content ? content.innerHTML : undefined,
    };
  }

  static get sanitize() {
    return {
      neyarText: {
        br: true,
      },
    };
  }

  /**
   * set title of the block and icon of the block in the toolbox menu
   */
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
