import '@testing-library/react/dont-cleanup-after-each';

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';

import SelectField from './SelectField';

describe('Select Field Component', () => {
  beforeAll(() => {
    render(
      <SelectField
        id="name"
        name="name"
        placeholder="Input your name"
        options={[{ label: 'test', value: 'test' }]}
      />
    );
  });

  it('should render select field form container', async () => {
    const formControl = await screen.findAllByTestId(
      /form-container-form-control/i
    );
    expect(formControl).toHaveLength(1);
  });

  it('should render select field select input', async () => {
    const select = await screen.findAllByTestId(':r0:-select-field-select');
    expect(select).toHaveLength(1);
  });
});
