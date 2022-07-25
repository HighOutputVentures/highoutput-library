import {
  ButtonProps,
  Flex,
  FlexProps,
  HStack,
  Icon,
  IconButton,
  IconProps,
  Select,
  SelectProps,
  StackProps,
  Text,
  TextProps,
} from '@chakra-ui/react';
import * as React from 'react';
import ChevronLeftIcon from './ChevronLeftIcon';
import ChevronRightIcon from './ChevronRightIcon';

type WithoutChildren<T> = Omit<T, 'children'>;

export type PaginationProps<T extends number[] = number[]> = {
  page: number;
  size: T[number];
  total: number;
  onSizeChange: (newSize: T[number]) => void;
  onPageChange: (newPage: number) => void;
  options: {
    sizes: T;
  };
  /**
   *
   * _Not yet implemented_
   *
   */
  loading?: boolean;
  styles?: Partial<{
    container: WithoutChildren<FlexProps>;
    dropdown: WithoutChildren<SelectProps>;
    dropdownLabel: WithoutChildren<TextProps>;
    dropdownContainer: WithoutChildren<StackProps>;
    caption: WithoutChildren<TextProps>;
    captionAndControlsContainer: WithoutChildren<StackProps>;
    controls: WithoutChildren<ButtonProps>;
    controlIcons: WithoutChildren<IconProps>;
    controlsContainer: WithoutChildren<StackProps>;
  }>;
};

export default function Pagination<T extends number[]>({
  page,
  size,
  total,
  onPageChange,
  onSizeChange,
  options,
  styles,
}: PaginationProps<T>) {
  const id = React.useId();

  const hasPrev = page > 1;
  const hasNext = page * size < total;

  const handleSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSizeChange(parseInt(e.target.value));
  };

  const handlePageChange = (type: 'increment' | 'decrement') => {
    const newPage = type === 'increment' ? page + 1 : page - 1;

    return () => onPageChange(newPage);
  };

  const indexStart = (page - 1) * size + 1;
  const indexStop = page * size;
  const remainder = total % size;

  const getPageInfo = React.useCallback(() => {
    let pageInfo = '';

    pageInfo += 'Page ';
    pageInfo += indexStart;
    pageInfo += '-';
    pageInfo += indexStop > total ? indexStart - 1 + remainder : indexStop;
    pageInfo += ' of ';
    pageInfo += total;

    return pageInfo;
  }, [indexStart, indexStop, total, remainder]);

  return (
    <Flex
      id={id}
      alignItems="center"
      justifyContent="space-between"
      {...styles?.container}
    >
      <HStack spacing={2} {...styles?.dropdownContainer}>
        <Text as="span" whiteSpace="nowrap" {...styles?.dropdownLabel}>
          Show rows per page
        </Text>

        <Select
          data-testid="pagination.dropdown"
          onChange={handleSizeChange}
          value={size}
          {...styles?.dropdown}
        >
          {options.sizes.map((size, index) => (
            <option value={size} key={id + size + index}>
              {size}
            </option>
          ))}
        </Select>
      </HStack>

      <HStack spacing={4} {...styles?.captionAndControlsContainer}>
        <Text as="span" {...styles?.caption}>
          {getPageInfo()}
        </Text>

        <HStack {...styles?.controlsContainer}>
          <IconButton
            aria-label=""
            data-testid="pagination.controls.prev"
            icon={<Icon as={ChevronLeftIcon} {...styles?.controlIcons} />}
            onClick={handlePageChange('decrement')}
            disabled={!hasPrev}
            {...styles?.controls}
          />

          <IconButton
            aria-label=""
            data-testid="pagination.controls.next"
            icon={<Icon as={ChevronRightIcon} {...styles?.controlIcons} />}
            onClick={handlePageChange('increment')}
            disabled={!hasNext}
            {...styles?.controls}
          />
        </HStack>
      </HStack>
    </Flex>
  );
}
