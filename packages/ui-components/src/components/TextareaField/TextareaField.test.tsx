import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';

import TextareaField from './TextareaField';

describe('Form Container Component', () => {
  beforeEach(() => {
    render(
      <TextareaField
        id="description"
        label="description"
        placeholder="Write something here ..."
      />
    );
  });

  it('should renders form container', async () => {
    const formControl = await screen.findAllByTestId(
      'formcontainer.formcontrol'
    );
    expect(formControl).toHaveLength(1);
  });

  it('should renders text area field input', async () => {
    const textareInput = await screen.findAllByTestId('textareafield.input');
    expect(textareInput).toHaveLength(1);
  });
});
