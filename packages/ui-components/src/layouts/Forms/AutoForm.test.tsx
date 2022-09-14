import '@testing-library/react/dont-cleanup-after-each';

import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import AutoForm from './AutoForm';
import { autoFormSchema } from './validations';

describe('Auto form component', () => {
  beforeAll(() => {
    render(<AutoForm yupSchema={autoFormSchema} />);
  });

  it('should render form inputs', async () => {
    const inputs = await screen.findAllByTestId(':r0:-input-field-group');
    expect(inputs).toHaveLength(1);
  });

  it('should render form textarea', async () => {
    const inputs = await screen.findAllByTestId(/textarea-field-input/i);
    expect(inputs).toHaveLength(1);
  });

  test('user clicks submit with no value or invalid input and renders error messages', async () => {
    const submit = await screen.findByTestId('button.form.submit');
    await fireEvent.submit(submit);
    const errorFormControl = await screen.findAllByTestId(
      /form-container-error/i
    );
    expect(errorFormControl).toHaveLength(2);
  });
});
