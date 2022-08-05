import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';

import OTPInputField from './PinInputField';

describe('Input Field Component', () => {
  beforeEach(() => {
    render(
      <OTPInputField name="input" onBlur={jest.fn()} onChange={jest.fn()} />
    );
  });

  it('should renders pin input field form container', async () => {
    const formControl = await screen.findAllByTestId(
      'formcontainer.formcontrol'
    );
    expect(formControl).toHaveLength(1);
  });
});
