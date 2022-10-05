export const Tabs = {
  parts: ['tab', 'tabpanel', 'tablist'],
  baseStyle: {
    root: { w: 'full', mt: 6 },
    tab: { fontWeight: 'semibold', color: 'gray.500', marginRight: 4 },
    tabpanel: { p: 0, mt: 4, mb: 12 },
  },
  variants: {
    primary: {
      tab: {
        _selected: {
          paddingBottom: '6px',
          borderBottom: '2px solid',
          borderBottomColor: 'brand.primary.700',
          color: 'gray.800',
          fontWeight: 'semibold',
        },
        _focus: { boxShadow: 'none' },
        marginBottom: '-2px',
      },
      tablist: {
        borderBottom: '1px solid',
        borderBottomColor: 'gray.100',
      },
    },
  },
  defaultProps: {
    variant: 'primary',
  },
};

export default Tabs;
