import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import OTPLoginForm from './OTPLoginForm';

describe('One Time Password Login Component', () => {
  beforeEach(() => {
    render(<OTPLoginForm />);
  });

  it('should render button submit for otp', async () => {
    const submitButton = await screen.findAllByTestId('button.otp.submit');
    expect(submitButton).toHaveLength(1);
  });
  test('user clicks submit with no value or incomplete input and renders error messages', async () => {
    const submit = await screen.findByTestId('box.otpform.form');
    await fireEvent.submit(submit);
    const errorFormControl = await screen.findAllByTestId(
      'formcontainer.error'
    );
    expect(errorFormControl).toHaveLength(1);
  });
});
