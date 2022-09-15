import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import ContactCard from './ContactCard';
import { Default as ContactCardComponent } from './ContactCard.stories';
import ContactForm from './ContactForm';
import { Default as ContactFormComponent } from './ContactForm.stories';
import ContactPage from './ContactPage';
import { Default as ContactPageComponent } from './ContactPage.stories';

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
    const inputFields = await screen.findAllByTestId(/input-field-input/i);
    expect(inputFields).toHaveLength(2);
  });

  it('should render input field name', async () => {
    const { container } = render(<ContactForm />);
    const inputName = container.querySelector(`input[id="name"]`);
    expect(inputName).toBeInTheDocument();
  });

  it('should render input field email', async () => {
    const { container } = render(<ContactForm />);
    const inputEmail = container.querySelector(`input[id="emailAddress"]`);
    expect(inputEmail).toBeInTheDocument();
  });

  it('should render textarea field description', async () => {
    const { container } = render(<ContactForm />);
    const textareaDescription = container.querySelector(
      `textarea[id="message"]`
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
      /form-container-error/i
    );
    expect(errorFormContorl).toHaveLength(3);
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

describe('Storybook - Contact Form Component', () => {
  beforeEach(() => {
    render(<ContactFormComponent />);
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
    const inputFields = await screen.findAllByTestId(/input-field-input/i);
    expect(inputFields).toHaveLength(2);
  });

  it('should render input field name', async () => {
    const { container } = render(<ContactForm />);
    const inputName = container.querySelector(`input[id="name"]`);
    expect(inputName).toBeInTheDocument();
  });

  it('should render input field email', async () => {
    const { container } = render(<ContactForm />);
    const inputEmail = container.querySelector(`input[id="emailAddress"]`);
    expect(inputEmail).toBeInTheDocument();
  });

  it('should render textarea field description', async () => {
    const { container } = render(<ContactForm />);
    const textareaDescription = container.querySelector(
      `textarea[id="message"]`
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
      /form-container-error/i
    );
    expect(errorFormContorl).toHaveLength(3);
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

describe('Contact Card Component', () => {
  beforeEach(() => {
    render(<ContactCard />);
  });

  it('should render contact card container', async () => {
    const contactCardContainer = await screen.findAllByTestId(
      'box.contactcard.container'
    );
    expect(contactCardContainer).toHaveLength(1);
  });

  it('should render title in center position', async () => {
    const titleCenter = await screen.findAllByTestId(
      'center.contactcard.titleposition'
    );
    expect(titleCenter).toHaveLength(1);
  });

  it('should render title', async () => {
    const title = await screen.findAllByTestId('text.contactcard.title');
    expect(title).toHaveLength(1);
  });

  it('should render title pass from props', async () => {
    const { getByText } = render(<ContactCard title="Test title" />);
    const title = getByText(/test title/i);
    expect(title).toBeInTheDocument();
  });
});

describe('Storybook - Contact Card Component', () => {
  beforeEach(() => {
    render(<ContactCardComponent />);
  });

  it('should render contact card container', async () => {
    const contactCardContainer = await screen.findAllByTestId(
      'box.contactcard.container'
    );
    expect(contactCardContainer).toHaveLength(1);
  });

  it('should render title in center position', async () => {
    const titleCenter = await screen.findAllByTestId(
      'center.contactcard.titleposition'
    );
    expect(titleCenter).toHaveLength(1);
  });

  it('should render title', async () => {
    const title = await screen.findAllByTestId('text.contactcard.title');
    expect(title).toHaveLength(1);
  });

  it('should render title pass from props', async () => {
    const { getByText } = render(<ContactCardComponent title="Test title" />);
    const title = getByText(/test title/i);
    expect(title).toBeInTheDocument();
  });
});

describe('Contact Page Component', () => {
  beforeEach(() => {
    render(<ContactPage />);
  });

  it('should render contact page container', async () => {
    const contactPageContainer = await screen.findAllByTestId(
      'box.contactpage.container'
    );
    expect(contactPageContainer).toHaveLength(1);
  });

  it('should render contact page banner', async () => {
    const contactPageBanner = await screen.findAllByTestId(
      'box.contactpage.banner'
    );
    expect(contactPageBanner).toHaveLength(1);
  });

  it('should render hov icon in center', async () => {
    const hovIconPosition = await screen.findAllByTestId(
      'center.contactpage.iconposition'
    );
    expect(hovIconPosition).toHaveLength(1);
  });

  it('should render hov icon', async () => {
    const hovIcon = await screen.findAllByTestId('icon.contactpage.hovicon');
    expect(hovIcon).toHaveLength(1);
  });

  it('should render title center position', async () => {
    const titleCenterPosition = await screen.findAllByTestId(
      'center.contactpage.titlepostion'
    );
    expect(titleCenterPosition).toHaveLength(1);
  });

  it('should render title', async () => {
    const title = await screen.findAllByTestId('text.contactpage.title');
    expect(title).toHaveLength(1);
  });
});

describe('Storybook - Contact Page Component', () => {
  beforeEach(() => {
    render(<ContactPageComponent />);
  });

  it('should render contact page container', async () => {
    const contactPageContainer = await screen.findAllByTestId(
      'box.contactpage.container'
    );
    expect(contactPageContainer).toHaveLength(1);
  });

  it('should render contact page banner', async () => {
    const contactPageBanner = await screen.findAllByTestId(
      'box.contactpage.banner'
    );
    expect(contactPageBanner).toHaveLength(1);
  });

  it('should render hov icon in center', async () => {
    const hovIconPosition = await screen.findAllByTestId(
      'center.contactpage.iconposition'
    );
    expect(hovIconPosition).toHaveLength(1);
  });

  it('should render hov icon', async () => {
    const hovIcon = await screen.findAllByTestId('icon.contactpage.hovicon');
    expect(hovIcon).toHaveLength(1);
  });

  it('should render title center position', async () => {
    const titleCenterPosition = await screen.findAllByTestId(
      'center.contactpage.titlepostion'
    );
    expect(titleCenterPosition).toHaveLength(1);
  });

  it('should render title', async () => {
    const title = await screen.findAllByTestId('text.contactpage.title');
    expect(title).toHaveLength(1);
  });
});
