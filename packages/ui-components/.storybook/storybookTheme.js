// .storybook/YourTheme.js

import { create } from '@storybook/theming';

export default create({
  base: 'light',

  colorPrimary: '#7070DD',
  colorSecondary: '#7070DD',

  appBg: '#FAFAFA',
  appContentBg: '#FAFAFA',
  appBorderColor: 'grey',
  appBorderRadius: 4,

  fontBase: '"Open Sans", sans-serif',
  fontCode: 'monospace',

  textColor: '#0F0F0F',
  textInverseColor: 'rgba(255,255,255,0.9)',

  barTextColor: '#0F0F0F',
  barSelectedColor: '#7070DD',
  barBg: '#FAFAFA',

  inputBg: '#FAFAFA',
  inputBorder: 'silver',
  inputTextColor: '#0F0F0F',
  inputBorderRadius: 4,

  brandTitle: 'HOV UI Components',
  brandUrl: 'https://hov-ui-components-highoutput.vercel.app/',
  brandTarget: '_self',
});
