import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';

import InputField from './InputField';

describe('Input Field Component', () => {
  beforeEach(() => {
    render(<InputField id="name" name="name" placeholder="Input your name" />);
  });

  it('should renders input field form container', async () => {
    const formControl = await screen.findAllByTestId(
      'formcontainer.formcontrol'
    );
    expect(formControl).toHaveLength(1);
  });
});
