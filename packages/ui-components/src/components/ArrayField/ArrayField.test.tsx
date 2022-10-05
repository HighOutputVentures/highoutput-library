import '@testing-library/react/dont-cleanup-after-each';

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';

import ArrayField from './ArrayField';

describe('Array Field Component', () => {
  beforeAll(() => {
    render(
      <ArrayField
        defaultValues={{
          input: [
            {
              value: '',
            },
          ],
        }}
        maxValue={5}
        onChange={jest.fn()}
        onRemove={jest.fn()}
        onAppend={jest.fn()}
        onBlur={jest.fn()}
      />
    );
  });

  it('should renders input field form container', async () => {
    const formControl = await screen.findAllByTestId(
      ':r1:-form-container-form-control'
    );
    expect(formControl).toHaveLength(1);
  });

  it('should renders input field input group', async () => {
    const inputGroup = await screen.findAllByTestId(':r0:-input-field-group');
    expect(inputGroup).toHaveLength(1);
  });

  it('should renders input field input', async () => {
    const input = await screen.findAllByTestId(':r0:-input-field-input');
    expect(input).toHaveLength(1);
  });
});
