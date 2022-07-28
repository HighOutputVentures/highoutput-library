import '@testing-library/react/dont-cleanup-after-each';

import { fireEvent, render, screen } from '@testing-library/react';
import * as React from 'react';
import Pagination from './Pagination';

const handlePageChange = jest.fn();
const handleSizeChange = jest.fn();

describe('Pagination', () => {
  beforeAll(() => {
    render(
      <Pagination
        page={2}
        size={5}
        total={75}
        onPageChange={handlePageChange}
        onSizeChange={handleSizeChange}
        options={{
          sizes: [5, 10, 25, 50],
        }}
      />
    );
  });

  it('Should be able to change page size', async () => {
    const dropdown = await screen.getByTestId(':r0:-pagination.dropdown');

    fireEvent.change(dropdown, {
      target: {
        value: 15,
      },
    });

    expect(handleSizeChange).toBeCalledWith(expect.any(Number));
  });

  it('Should be able to go to previous page', async () => {
    const prevBtn = await screen.getByTestId(':r0:-pagination.controls.prev');
    fireEvent.click(prevBtn);
    expect(handlePageChange).toBeCalledWith(expect.any(Number));
  });

  it('Should be able to go to next page', async () => {
    const nextBtn = await screen.getByTestId(':r0:-pagination.controls.next');
    fireEvent.click(nextBtn);
    expect(handlePageChange).toBeCalledWith(expect.any(Number));
  });
});
