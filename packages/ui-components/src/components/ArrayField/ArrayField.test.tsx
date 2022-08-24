import '@testing-library/jest-dom';
import { cleanup, render, screen } from '@testing-library/react';
import React from 'react';

import ArrayField from './ArrayField';

describe('Array Field Component', () => {
  afterEach(cleanup);

  beforeEach(() => {
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
      'formcontainer.formcontrol'
    );
    expect(formControl).toHaveLength(1);
  });

  it('should renders input field input group', async () => {
    const inputGroup = await screen.findAllByTestId('inputfield.inputgroup');
    expect(inputGroup).toHaveLength(1);
  });

  it('should renders input field input', async () => {
    const input = await screen.findAllByTestId('inputfield.input');
    expect(input).toHaveLength(1);
  });
});
