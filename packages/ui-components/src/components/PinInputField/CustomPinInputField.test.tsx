import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';

import CustomPinInputField from './CustomPinInputField';

describe('Input Field Component', () => {
  beforeEach(() => {
    render(
      <CustomPinInputField
        name="input"
        onBlur={jest.fn()}
        onChange={jest.fn()}
      />
    );
  });

  it('should renders pin input field form container', async () => {
    const formControl = await screen.findAllByTestId(
      'formcontainer.formcontrol'
    );
    expect(formControl).toHaveLength(1);
  });
});
