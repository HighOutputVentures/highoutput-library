import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import ContactForm from './ContactForm';

describe('Contact Form Component', () => {
  beforeEach(() => {
    render(<ContactForm />);
  });

  it('should render contact form container', async () => {
    const contactFormContainer = await screen.findAllByTestId(
      'box.contactform.container'
    );
    expect(contactFormContainer).toHaveLength(1);
  });

  it('should render contact form as form', async () => {
    const contactFormAsForm = await screen.findAllByTestId(
      'box.contactform.form'
    );
    expect(contactFormAsForm).toHaveLength(1);
  });

  it('should render 2 input field', async () => {
    const inputFields = await screen.findAllByTestId('inputfield.input');
    expect(inputFields).toHaveLength(2);
  });

  it('should render input field name', async () => {
    const { container } = render(<ContactForm />);
    const inputName = container.querySelector(`input[id="name"]`);
    expect(inputName).toBeInTheDocument();
  });

  it('should render input field email', async () => {
    const { container } = render(<ContactForm />);
    const inputEmail = container.querySelector(`input[id="email"]`);
    expect(inputEmail).toBeInTheDocument();
  });

  it('should render select field category', async () => {
    const { container } = render(<ContactForm />);
    const selectCategory = container.querySelector(`select[id="category"]`);
    expect(selectCategory).toBeInTheDocument();
  });

  it('should render textarea field description', async () => {
    const { container } = render(<ContactForm />);
    const textareaDescription = container.querySelector(
      `textarea[id="description"]`
    );
    expect(textareaDescription).toBeInTheDocument();
  });

  it('should render button submit', async () => {
    const submitButton = await screen.findAllByTestId(
      'button.contactform.submit'
    );
    expect(submitButton).toHaveLength(1);
  });

  test('user clicks submit in contact form with no value and renders error messages', async () => {
    const submit = await screen.findByTestId('box.contactform.form');
    await fireEvent.submit(submit);
    const errorFormContorl = await screen.findAllByTestId(
      'formcontainer.error'
    );
    expect(errorFormContorl).toHaveLength(4);
  });

  test('user clicks submit in contact form must contain name is required', async () => {
    const submit = await screen.findByTestId('box.contactform.form');
    await fireEvent.submit(submit);
    const nameRequired = await screen.findByText(/name is required./i);
    expect(nameRequired).toBeInTheDocument();
  });

  test('user clicks submit in contact form must contain email is required', async () => {
    const submit = await screen.findByTestId('box.contactform.form');
    await fireEvent.submit(submit);
    const nameRequired = await screen.findByText(/email is required./i);
    expect(nameRequired).toBeInTheDocument();
  });

  test('user clicks submit in contact form must contain category is required', async () => {
    const submit = await screen.findByTestId('box.contactform.form');
    await fireEvent.submit(submit);
    const nameRequired = await screen.findByText(/category is required./i);
    expect(nameRequired).toBeInTheDocument();
  });

  test('user clicks submit in contact form must contain description is required', async () => {
    const submit = await screen.findByTestId('box.contactform.form');
    await fireEvent.submit(submit);
    const nameRequired = await screen.findByText(/description is required./i);
    expect(nameRequired).toBeInTheDocument();
  });

  test('contact form email validation', async () => {
    const emailInput = await screen.findByPlaceholderText(
      'Input your email address'
    );
    await fireEvent.change(emailInput, { target: { value: 'test' } });
    const submit = await screen.findByTestId('box.contactform.form');
    await fireEvent.submit(submit);
    const emailValid = await screen.findByText(
      /please enter a valid email address./i
    );
    expect(emailValid).toBeInTheDocument();
  });
});
