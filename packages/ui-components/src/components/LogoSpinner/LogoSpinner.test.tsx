import { cleanup, render } from '@testing-library/react';
import * as React from 'react';
import LogoSpinner from './LogoSpinner';

const duration = Math.random();

jest.mock('./LogoSpinner', () => {
  return ({ children }: React.PropsWithChildren<{ duration: number }>) => {
    return <div>{children}</div>;
  };
});

describe('LogoSpinner', () => {
  afterEach(cleanup);

  it('Should render children', () => {
    const { getByText } = render(
      <LogoSpinner duration={duration}>
        <div>Hello world</div>
      </LogoSpinner>
    );

    expect(getByText('Hello world')).toBeDefined();
  });
});
