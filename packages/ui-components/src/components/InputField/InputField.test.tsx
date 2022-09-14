import '@testing-library/react/dont-cleanup-after-each';

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';

import InputField from './InputField';

describe('Input Field Component', () => {
  beforeAll(() => {
    render(
      <InputField
        id="name"
        name="name"
        placeholder="Input your name"
        leftIcon={<>left</>}
        rightIcon={<>right</>}
      />
    );
  });

  it('should renders input field form container', async () => {
    const formControl = await screen.findAllByTestId(
      ':r1:-form-container-form-control'
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

  it('should renders input field left element', async () => {
    const leftELement = await screen.findAllByTestId(
      ':r0:-input-field-left-element'
    );
    expect(leftELement).toHaveLength(1);
  });

  it('should renders input field right element', async () => {
    const rightELement = await screen.findAllByTestId(
      ':r0:-input-field-right-element'
    );
    expect(rightELement).toHaveLength(1);
  });
});
