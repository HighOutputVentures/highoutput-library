import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import OTPWithEmailLoginForm from './OTPWithEmailLoginForm';

describe('Email Login Component', () => {
  beforeEach(() => {
    render(<OTPWithEmailLoginForm otpReceived={false} />);
  });

  it('should render button submit for email', async () => {
    const submitButton = await screen.findAllByTestId('button.email.submit');
    expect(submitButton).toHaveLength(1);
  });
  test('user clicks submit with no value or invalid input and renders error messages', async () => {
    const submit = await screen.findByTestId('box.emailform.form');
    await fireEvent.submit(submit);
    const errorFormControl = await screen.findAllByTestId(
      'formcontainer.error'
    );
    expect(errorFormControl).toHaveLength(1);
  });
});
describe('One Time Password Verification Component', () => {
  beforeEach(() => {
    render(<OTPWithEmailLoginForm otpReceived={true} />);
  });

  it('should render otp component', async () => {
    const otpComponent = await screen.findAllByTestId('otp.component');
    expect(otpComponent).toHaveLength(1);
  });
});
