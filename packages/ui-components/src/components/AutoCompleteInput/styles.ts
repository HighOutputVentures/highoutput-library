import { ChakraStylesConfig } from 'chakra-react-select';

export interface Item {
  value: string | number;
  label: string;
}

interface GetStylesProps {
  error?: boolean;
  multiple?: boolean;
  darkMode?: boolean;
  testId?: string;
}

const getStyles = ({
  error,
  darkMode,
  testId,
  multiple,
}: GetStylesProps): ChakraStylesConfig<Item> => {
  return {
    menuList: provided => ({
      ...provided,
      _active: {
        background: 'transparent',
      },
      '&::-webkit-scrollbar': {
        width: '16px',
        scrollBehavior: 'smooth',
      },
      '&::-webkit-scrollbar-thumb': {
        background: '#E2E8F0',
        border: '6px solid rgba(0, 0, 0, 0)',
        backgroundClip: 'padding-box',
        borderRadius: '9999px',
      },
      backgroundColor: darkMode ? '#2E2E2E' : undefined,
      maxHeight: '210px',
    }),
    multiValueLabel: baseStyle => ({
      ...baseStyle,
      color: darkMode ? 'neutrals.100' : 'neutrals.700',
      fontSize: 'paragraphs-xs-default',
      letterSpacing: '0.02em',
    }),

    multiValue: baseStyle => {
      return {
        ...baseStyle,
        backgroundColor: darkMode ? 'neutrals.800' : 'alpha.white.500',
        border: `1px solid`,
        borderColor: error
          ? 'interface.error.700'
          : darkMode
          ? 'neutrals.700'
          : 'neutrals.200',
        borderRadius: '6px',
        padding: '2px 5px',
        height: '24px',
        marginRight: '6px',
        'data-testid': testId,
      };
    },
    valueContainer: provided => ({ ...provided, padding: '0 0' }),
    multiValueRemove: provided => ({
      ...provided,
      _hover: {
        backgroundColor: 'none',
      },
      color: 'neutrals.400',
    }),
    control: (base, state) => {
      return {
        ...base,
        _focus: {
          borderColor: error ? 'interface.error.700' : 'brand.primary.700',
        },
        _focusVisible: {
          outline: 'none',
        },
        _invalid: {
          borderColor: 'interface.error.700',
          _hover: { borderColor: 'none' },
        },
        _hover: {
          borderColor: 'brand.primary.700',
        },
        border: '1px solid',
        color: 'neutrals.900',
        backgroundColor: darkMode ? 'neutrals.800' : 'alpha.white.500',
        padding: multiple && state.hasValue ? '0px 14px' : '0px 12px',
        height: '44px',
        boxShadow: '0px 1px 2px rgba(16, 24, 40, 0.05)',
        borderRadius: '8px',
      };
    },
    option: (style, { isFocused, isSelected }) => {
      return {
        ...style,
        backgroundColor: isFocused
          ? darkMode
            ? 'neutrals.700'
            : 'gray.50'
          : isSelected
          ? darkMode
            ? 'neutrals.800'
            : 'gray.50'
          : undefined,
        _hover: {
          backgroundColor: darkMode ? '#525252' : 'gray.50',
        },
        _active: {
          backgroundColor: isSelected
            ? darkMode
              ? 'neutrals.700'
              : 'gray.400'
            : undefined,
        },
        color: darkMode ? 'neutrals.100' : 'neutrals.900',
      };
    },
    menu: style => {
      return {
        ...style,
        zIndex: 9,
        backgroundColor: darkMode ? 'neutrals.800' : 'white',
      };
    },
    singleValue: styles => ({
      ...styles,
      color: darkMode ? 'neutrals.100' : 'neutrals.900',
      fontSize: 'paragraph-sm-default',
    }),
  };
};

export default getStyles;
