import { render, screen } from '@testing-library/react';
import React from 'react';
import ThemeProvider from '../ThemeProvider';

import AutoCompleteInput from './AutoCompleteInput';

const OPTIONS = ['user1', 'user2', 'user3', 'user4', 'user5'];

const SELECT_OPTION = Object.entries(OPTIONS).map(([value, label]) => {
  return {
    value,
    label,
  };
});

describe('AutoCompleteInput Component', () => {
  beforeEach(() => {
    render(
      <ThemeProvider>
        <AutoCompleteInput
          label="Users"
          options={SELECT_OPTION}
          onChangeValue={jest.fn()}
        />
      </ThemeProvider>
    );
  });

  it('Should render auto complete input field form container', async () => {
    const formControl = await screen.findAllByTestId(
      ':r1:-form-container-form-control'
    );
    expect(formControl).toHaveLength(1);
  });
  it('Should render auto complete input field label', async () => {
    const formControlLabel = await screen.findAllByTestId(
      ':r4:-form-container-label'
    );
    expect(formControlLabel).toHaveLength(1);
  });
  it('Should render auto complete input field', async () => {
    const autoCompleteInput = await screen.findAllByRole('combobox', {
      name: 'auto-complete-input',
    });

    expect(autoCompleteInput).toHaveLength(1);
  });
});
