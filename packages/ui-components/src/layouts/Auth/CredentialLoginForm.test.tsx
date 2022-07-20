import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import CredentialLoginForm from './CredentialLoginForm';

describe('Login Form Component', () => {
  it('should display error message on email', async () => {
    render(<CredentialLoginForm />);
    const emailInput = screen.getByRole('input', { name: 'email-input' });
    const submitBtn = screen.getByRole('button', { name: 'Login' });
    fireEvent.change(emailInput, { target: { value: 'hello@g' } });
    fireEvent.click(submitBtn);
    await waitFor(() =>
      expect(
        screen.getByText('Please enter a valid email address')
      ).toBeInTheDocument()
    );
  });
  it('should display error message on name', async () => {
    render(
      <CredentialLoginForm variant="name-password" nameLabel="Username" />
    );
    const nameInput = screen.getByRole('input', { name: 'name-input' });
    const submitBtn = screen.getByRole('button', { name: 'Login' });
    fireEvent.change(nameInput, { target: { value: null } });
    fireEvent.click(submitBtn);
    await waitFor(() =>
      expect(screen.getByText('Name is required')).toBeInTheDocument()
    );
  });
  it('should display error message on password', async () => {
    render(<CredentialLoginForm />);
    const passwordInput = screen.getByRole('input', { name: 'password-input' });
    const submitBtn = screen.getByRole('button', { name: 'Login' });
    fireEvent.change(passwordInput, { target: { value: null } });
    fireEvent.click(submitBtn);
    await waitFor(() =>
      expect(screen.getByText('Password is required')).toBeInTheDocument()
    );
  });
  it('should toggle showing and hiding password', () => {
    render(<CredentialLoginForm />);
    const showHideBtn = screen.getByTestId('show-hide-btn');
    fireEvent.click(showHideBtn);
    expect(
      screen.getByRole('button', { name: 'show-password' })
    ).toBeInTheDocument();
    fireEvent.click(showHideBtn);
    expect(
      screen.getByRole('button', { name: 'hide-password' })
    ).toBeInTheDocument();
  });
  it('should toggle login to signup form', async () => {
    render(<CredentialLoginForm />);
    const switchLink = screen.getByTestId('switch-form-link');
    fireEvent.click(switchLink);
    await waitFor(() =>
      expect(
        screen.getByRole('link', { name: 'login-link-label' })
      ).toBeInTheDocument()
    );
    fireEvent.click(switchLink);
    await waitFor(() =>
      expect(
        screen.getByRole('link', { name: 'signup-link-label' })
      ).toBeInTheDocument()
    );
  });
});
