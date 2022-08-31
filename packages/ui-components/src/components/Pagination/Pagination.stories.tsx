import { useArgs } from '@storybook/client-api';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import * as React from 'react';

import { ThemeProvider } from '../..';
import Pagination from './Pagination';

export default {
  title: 'Components/Pagination',
  component: Pagination,
} as ComponentMeta<typeof Pagination>;

const Template: ComponentStory<typeof Pagination> = props => {
  const [args, setArgs] = useArgs();

  const handlePageChange = (page: number) => {
    setArgs({ ...args, page });
  };

  const handleSizeChange = (size: number) => {
    setArgs({ ...args, size, page: 1 });
  };

  return (
    <ThemeProvider>
      <Pagination
        {...props}
        page={args.page}
        size={args.size}
        total={args.total}
        options={args.options}
        loading={args.loading}
        onPageChange={handlePageChange}
        onSizeChange={handleSizeChange}
        partProps={args.styles}
      />
    </ThemeProvider>
  );
};

export const Default = Template.bind({});

const noop = () => {};

Default.args = {
  page: 1,
  size: 5,
  options: {
    sizes: [5, 10, 25, 50],
  },
  loading: false,
  onPageChange: noop,
  onSizeChange: noop,
  total: 75,
  partProps: {
    container: {
      fontSize: 'sm',
    },
    controls: {
      rounded: 'full',
    },
    controlIcons: {
      fontSize: 'xl',
    },
    dropdown: {
      border: '1px solid',
      borderColor: 'gray.200',
    },
  },
};
