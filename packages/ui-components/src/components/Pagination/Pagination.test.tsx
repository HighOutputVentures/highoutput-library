import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import * as React from 'react';
import Pagination from './Pagination';

const handlePageChange = jest.fn();
const handleSizeChange = jest.fn();

describe('Pagination', () => {
  afterEach(cleanup);

  beforeEach(() => {
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

  it('Should be able to change page size', () => {
    const dropdown = screen.getByTestId<HTMLSelectElement>(
      'pagination.dropdown'
    );

    fireEvent.change(dropdown, {
      target: {
        value: 15,
      },
    });

    expect(handleSizeChange).toBeCalledWith(expect.any(Number));
  });

  it('Should be able to go to previous page', () => {
    const button = screen.getByTestId('pagination.controls.prev');
    fireEvent.click(button);
    expect(handlePageChange).toBeCalledWith(expect.any(Number));
  });

  it('Should be able to go to next page', () => {
    const button = screen.getByTestId('pagination.controls.next');
    fireEvent.click(button);
    expect(handlePageChange).toBeCalledWith(expect.any(Number));
  });
});
