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

  barTextColor: '#FAFAFA',
  barSelectedColor: '#0F0F0F',
  barBg: '#7070DD',

  inputBg: '#FAFAFA',
  inputBorder: 'silver',
  inputTextColor: '#0F0F0F',
  inputBorderRadius: 4,

  brandTitle: 'HOV UI Components',
  brandUrl: 'https://ui-components-nberongoy.vercel.app/',
  brandTarget: '_self',
});
