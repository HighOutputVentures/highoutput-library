import '@testing-library/react/dont-cleanup-after-each';

import { render, screen } from '@testing-library/react';
import React from 'react';
import PasswordInputField from './PasswordInputField';

describe('Password Input Field Component', () => {
  beforeAll(() => {
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
      /form-container-form-control/i
    );
    expect(formControl).toHaveLength(1);
  });
  it('should renders input field input group', async () => {
    const inputGroup = await screen.findAllByTestId(':r0:-input-field-group');
    expect(inputGroup).toHaveLength(1);
  });
  it('should renders input field input', async () => {
    const input = await screen.findAllByTestId(':r0:-input-field-input');
    expect(input).toHaveLength(1);
  });
  it('should renders input field right element', async () => {
    const rightElement = await screen.findAllByTestId(
      ':r0:-input-field-right-element'
    );
    expect(rightElement).toHaveLength(1);
  });
});
