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
import React, { FC, useCallback, useId } from 'react';
import ChevronLeftIcon from './ChevronLeftIcon';
import ChevronRightIcon from './ChevronRightIcon';

type WithoutChildren<T> = Omit<T, 'children'>;

export type PaginationProps = {
  page: number;
  size: number;
  total: number;
  onSizeChange?: (newSize: number) => void;
  onPageChange?: (newPage: number) => void;
  options: {
    sizes: number[];
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

const Pagination: FC<PaginationProps> = ({
  page,
  size,
  total,
  onPageChange,
  onSizeChange,
  options,
  styles,
}) => {
  const id = useId();

  const hasPrev = page > 1;
  const hasNext = page * size < total;

  const handleSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onSizeChange) onSizeChange(parseInt(e.target.value));
  };

  const handlePageChange = (type: 'increment' | 'decrement') => {
    const newPage = type === 'increment' ? page + 1 : page - 1;

    return () => (onPageChange ? onPageChange(newPage) : newPage);
  };

  const indexStart = (page - 1) * size + 1;
  const indexStop = page * size;
  const remainder = total % size;

  const getPageInfo = useCallback(() => {
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
};

export default Pagination;
