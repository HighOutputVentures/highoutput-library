import '@testing-library/jest-dom';
import { cleanup, render, screen } from '@testing-library/react';
import React from 'react';

import PinInputField from './PinInputField';

describe('Pin Input Field Component', () => {
  afterEach(cleanup);

  beforeEach(() => {
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
      'formcontainer.formcontrol'
    );
    expect(formControl).toHaveLength(1);
  });

  it('should render pin input field pin', async () => {
    const pin = await screen.findAllByTestId('pininput.pin');
    expect(pin).toHaveLength(6);
  });
});
