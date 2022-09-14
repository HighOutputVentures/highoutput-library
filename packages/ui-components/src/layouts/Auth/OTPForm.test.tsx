import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import OTPForm from './OTPForm';

describe('One Time Password Login Component', () => {
  beforeEach(() => {
    render(<OTPForm />);
  });

  it('should render button submit for otp', async () => {
    const submitButton = await screen.findAllByTestId('button.otp.submit');
    expect(submitButton).toHaveLength(1);
  });
  test('user clicks submit with no value or incomplete input and renders error messages', async () => {
    const submit = await screen.findByTestId('box.otpform.form');
    await fireEvent.submit(submit);
    const errorFormControl = await screen.findAllByTestId(
      /form-container-error/i
    );
    expect(errorFormControl).toHaveLength(1);
  });
});
