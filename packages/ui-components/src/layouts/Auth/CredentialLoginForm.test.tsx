import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import CredentialLoginForm from './CredentialLoginForm';

describe('Login Form Email-based Component', () => {
  beforeEach(() => {
    render(<CredentialLoginForm />);
  });
  it('should display error message on email', async () => {
    const emailInput = screen.getByRole('input', { name: 'email-input' });
    const submitBtn = screen.getByRole('button', { name: 'Login' });
    fireEvent.change(emailInput, { target: { value: 'hello@g' } });
    fireEvent.click(submitBtn);
    const errorText = await screen.findByText(
      /please enter a valid email address/i
    );
    expect(errorText).toBeInTheDocument();
  });

  it('should display error message on password', async () => {
    const passwordInput = screen.getByRole('input', { name: 'password-input' });
    const submitBtn = screen.getByRole('button', { name: 'Login' });
    fireEvent.change(passwordInput, { target: { value: null } });
    fireEvent.click(submitBtn);
    const errorText = await screen.findByText(/password is required/i);
    expect(errorText).toBeInTheDocument();
  });
  it('should toggle showing and hiding password', () => {
    const showHideBtn = screen.getByTestId('show-hide-btn');
    fireEvent.click(showHideBtn);
    const showPasswordLabel = screen.getByRole('button', {
      name: 'show-password',
    });
    expect(showPasswordLabel).toBeInTheDocument();
    fireEvent.click(showHideBtn);
    const hidePasswordLabel = screen.getByRole('button', {
      name: 'hide-password',
    });
    expect(hidePasswordLabel).toBeInTheDocument();
  });
  it('should toggle login to signup form', async () => {
    const switchLink = screen.getByTestId('switch-form-link');
    fireEvent.click(switchLink);
    const textLoginLabel = screen.getByRole('link', {
      name: 'login-link-label',
    });
    expect(textLoginLabel).toBeInTheDocument();
    fireEvent.click(switchLink);
    const textSignUpLabel = await screen.findByRole('link', {
      name: 'signup-link-label',
    });
    expect(textSignUpLabel).toBeInTheDocument();
  });
});
describe('Login form Username-based component', () => {
  beforeEach(() => {
    render(
      <CredentialLoginForm variant="name-password" nameLabel="Username" />
    );
  });
  it('should display error message on name', async () => {
    const nameInput = screen.getByRole('input', { name: 'name-input' });
    const submitBtn = screen.getByRole('button', { name: 'Login' });
    fireEvent.change(nameInput, { target: { value: null } });
    fireEvent.click(submitBtn);
    const errorText = await screen.findByText(/name is required/i);
    expect(errorText).toBeInTheDocument();
  });
});
