import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import OTPWithEmailLoginForm from './OTPWithEmailLoginForm';

describe('One Time Password Login Component', () => {
  beforeEach(() => {
    render(<OTPWithEmailLoginForm otpType="number" />);
  });

  it('should render button submit', async () => {
    const submitButton = await screen.findAllByTestId('button.email.submit');
    expect(submitButton).toHaveLength(1);
  });
  test('user clicks submit with no value or invalid input and renders error messages', async () => {
    const submit = await screen.findByTestId('box.emailform.form');
    await fireEvent.submit(submit);
    const errorText = await screen.findByText(
      /please enter a valid email address/i
    );
    expect(errorText).toBeInTheDocument();
  });
});
