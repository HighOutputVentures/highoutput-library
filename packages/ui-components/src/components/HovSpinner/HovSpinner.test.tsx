import { cleanup, render } from '@testing-library/react';
import * as React from 'react';
import HovSpinner from './HovSpinner';

const duration = Math.random();

jest.mock('./HovSpinner', () => {
  return ({ children }: React.PropsWithChildren<{ duration: number }>) => {
    return <div>{children}</div>;
  };
});

describe('HovSpinner', () => {
  afterEach(cleanup);

  it('Should render children', () => {
    const { getByText } = render(
      <HovSpinner duration={duration}>
        <div>Hello world</div>
      </HovSpinner>
    );

    expect(getByText('Hello world')).toBeDefined();
  });
});
