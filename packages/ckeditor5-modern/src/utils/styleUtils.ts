export const MODERN_EDITOR_STYLE = {
  '.ck-toolbar': {
    display: 'none',
  },
  '.ck-content': {
    border: 0,
    padding: 0,
    bg: 'transparent !important',
    '>:first-child': {
      marginTop: '0 !important',
    },
  },
  '.ck-focused': {
    border: '0 !important',
    boxShadow: 'none !important',
  },
  '::-webkit-scrollbar': {
    width: 2,
  },
  '::-webkit-scrollbar-track': {
    borderRadius: 16,
  },
  '::-webkit-scrollbar-thumb': {
    borderRadius: 16,
    backgroundColor: '#A4A1AF',
  },
};
