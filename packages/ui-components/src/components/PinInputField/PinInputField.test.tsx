import '@testing-library/react/dont-cleanup-after-each';

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';

import PinInputField from './PinInputField';

describe('Pin Input Field Component', () => {
  beforeAll(() => {
    render(
      <PinInputField
        id="otpPin"
        name="otpPin"
        onBlur={jest.fn()}
        onChange={jest.fn()}
      />
    );
  });

  it('should render pin input field form container', async () => {
    const formControl = await screen.findAllByTestId(
      ':r1:-form-container-form-control'
    );
    expect(formControl).toHaveLength(1);
  });

  it('should render pin input field pin', async () => {
    const pin = await screen.findAllByTestId(/:r0:-pininput-pin/i);
    expect(pin).toHaveLength(6);
  });
});
