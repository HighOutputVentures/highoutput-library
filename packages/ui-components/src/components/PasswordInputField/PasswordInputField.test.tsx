import { cleanup, render, screen } from '@testing-library/react';
import React from 'react';
import PasswordInputField from './PasswordInputField';

describe('Password Input Field Component', () => {
  beforeEach(() => {
    render(
      <PasswordInputField
        placeholder={'Password'}
        onChange={jest.fn()}
        onBlur={jest.fn()}
        name={'Password'}
      />
    );
  });

  it('Should render password input field form', async () => {
    const formControl = await screen.findAllByTestId(
      'formcontainer.formcontrol'
    );
    expect(formControl).toHaveLength(1);
  });
  it('should renders input field input group', async () => {
    const inputGroup = await screen.findAllByTestId('inputfield.inputgroup');
    expect(inputGroup).toHaveLength(1);
  });
  it('should renders input field input', async () => {
    const input = await screen.findAllByTestId('inputfield.input');
    expect(input).toHaveLength(1);
  });
  it('should renders input field right element', async () => {
    const rightELement = await screen.findAllByTestId(
      'inputfield.rightelement'
    );
    expect(rightELement).toHaveLength(1);
  });

  afterEach(cleanup);
});
