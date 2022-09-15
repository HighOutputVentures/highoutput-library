import '@testing-library/react/dont-cleanup-after-each';

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';

import TextareaField from './TextareaField';

describe('Form Container Component', () => {
  beforeAll(() => {
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
      /form-container-form-control/i
    );
    expect(formControl).toHaveLength(1);
  });

  it('should renders text area field input', async () => {
    const textareInput = await screen.findAllByTestId(
      ':r0:-textarea-field-input'
    );
    expect(textareInput).toHaveLength(1);
  });
});
