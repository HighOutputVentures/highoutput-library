import { useState } from '@storybook/addons';
import { ComponentMeta } from '@storybook/react';
import * as React from 'react';

import { ThemeProvider } from '../..';
import Pagination from './Pagination';

export default {
  title: 'UI Components/Pagination',
  component: Pagination,
} as ComponentMeta<typeof Pagination>;

export const Default = () => {
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(5);

  return (
    <ThemeProvider>
      <Pagination
        page={page}
        size={size}
        total={75}
        onPageChange={setPage}
        onSizeChange={setSize}
        options={{
          sizes: [5, 10, 25, 50],
        }}
        styles={{
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
        }}
      />
    </ThemeProvider>
  );
};
