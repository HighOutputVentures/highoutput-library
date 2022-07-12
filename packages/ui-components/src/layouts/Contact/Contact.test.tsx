import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';

import ContactForm from './ContactForm';

describe('Contact Form Component', () => {
  beforeEach(() => {
    render(<ContactForm />);
  });

  it('should renders contact form container', async () => {
    const contactFormContainer = await screen.findAllByTestId(
      'box.contactform.container'
    );
    expect(contactFormContainer).toHaveLength(1);
  });
});
