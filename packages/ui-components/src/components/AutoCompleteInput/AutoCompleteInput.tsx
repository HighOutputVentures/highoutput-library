import { Avatar, BoxProps, HStack, Icon } from '@chakra-ui/react';
import React, { useId } from 'react';

import {
  Select,
  MultiValue,
  SingleValue,
  chakraComponents,
  ChakraStylesConfig,
  GroupBase,
} from 'chakra-react-select';
import FormContainer, {
  FormContainerPartProps,
  FormContainerProps,
} from '../FormContainer/FormContainer';
import getStyles from './styles';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';

export interface Item {
  value: string | number;
  label: string;
}

export interface OptionItem extends Item {
  avatar?: string;
}

export interface AutoCompleteInputFieldPartProps
  extends FormContainerPartProps {
  reactChakraStyle?:
    | ChakraStylesConfig<Item, boolean, GroupBase<Item>>
    | undefined;
}

export interface AutoCompleteInputFieldProps
  extends Omit<FormContainerProps, 'partProps'> {
  options: OptionItem[];
  loading?: boolean;
  fieldLabelProps?: Omit<BoxProps, 'children'>;
  required?: boolean;
  placement?: 'auto' | 'top' | 'bottom';
  multiple?: boolean;
  darkMode?: boolean;
  autoFocus?: boolean;
  showDropdownIndicator?: boolean;
  placeholder?: string;
  partProps?: Partial<AutoCompleteInputFieldPartProps>;
  value?: string | string[] | number | number[];
  onChangeValue: (...event: any[]) => void;
}

const AutoCompleteInput = (props: AutoCompleteInputFieldProps) => {
  const {
    value,
    options,
    darkMode,
    placement,
    showDropdownIndicator,
    errorMsg,
    partProps,
    autoFocus,
    disabled,
    onChangeValue,
    multiple,
    loading,
    placeholder,
  } = props;

  const uid = useId();

  const styles = getStyles({
    error: Boolean(errorMsg),
    multiple,
    darkMode: darkMode,
  });

  return (
    <FormContainer {...props}>
      <Select
        options={options}
        chakraStyles={partProps?.reactChakraStyle ?? styles}
        placeholder={placeholder}
        menuPlacement={placement ?? 'auto'}
        isMulti={multiple}
        inputId="auto-complete-input"
        useBasicStyles
        aria-label="auto-complete-input"
        captureMenuScroll
        backspaceRemovesValue
        autoFocus={autoFocus}
        isLoading={loading}
        data-testid={`${uid}-auto-complete-input-field`}
        isSearchable
        isDisabled={disabled}
        isClearable
        components={{
          ClearIndicator: () => null,
          IndicatorSeparator: () => null,
          DropdownIndicator: ({ selectProps }) => {
            const icon = selectProps.menuIsOpen
              ? ChevronUpIcon
              : ChevronDownIcon;
            return showDropdownIndicator ? (
              <Icon as={icon} w={4} h={6} stroke="brand.primary.500" />
            ) : null;
          },
          MultiValueContainer: ({ children, data, ...props }) => (
            <chakraComponents.MultiValueContainer {...props} data={data}>
              <HStack align="center" spacing="5px">
                {data.avatar && (
                  <Avatar width="16px" height="16px" src={data.avatar} />
                )}
                {children}
              </HStack>
            </chakraComponents.MultiValueContainer>
          ),
        }}
        onChange={(options: MultiValue<Item> | (SingleValue<Item> | null)) => {
          return isArray<MultiValue<Item>>(options)
            ? onChangeValue(options.map(o => o.value))
            : onChangeValue(options?.value ?? null);
        }}
        value={options.filter(option => {
          return Array.isArray(value)
            ? value.some((val: string | number) => val === option.value)
            : value === option.value;
        })}
      />
    </FormContainer>
  );
};

export default AutoCompleteInput;

function isArray<T>(subject: unknown): subject is T {
  return Array.isArray(subject);
}
