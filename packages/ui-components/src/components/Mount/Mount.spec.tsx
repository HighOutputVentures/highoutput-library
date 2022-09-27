import { render } from '@testing-library/react';
import * as React from 'react';
import Mount from './Mount';

describe('Mount', () => {
  it('Should show component if conditions are met', () => {
    const condition = true;

    const { queryByText } = render(<Mount when={condition}>It works!</Mount>);

    expect(queryByText(/it works/i)).toBeDefined();
  });

  it("Should show component if conditions ain't met", () => {
    const condition = false;

    const { queryByText } = render(<Mount when={condition}>It works!</Mount>);

    expect(queryByText(/it works/i)).toBeNull();
  });
});
