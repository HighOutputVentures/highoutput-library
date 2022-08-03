import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import AutoForm from './AutoForm';
import { autoFormSchema } from './validations';

describe('Auto form component', () => {
  beforeEach(() => {
    render(<AutoForm yupSchema={autoFormSchema} />);
  });

  it('should render form inputs', async () => {
    const inputs = await screen.findAllByTestId('form.input.container');
    expect(inputs).toHaveLength(2);
  });
  test('user clicks submit with no value or invalid input and renders error messages', async () => {
    const submit = await screen.findByTestId('button.form.submit');
    await fireEvent.submit(submit);
    const errorFormControl = await screen.findAllByTestId(
      'formcontainer.error'
    );
    expect(errorFormControl).toHaveLength(2);
  });
});
