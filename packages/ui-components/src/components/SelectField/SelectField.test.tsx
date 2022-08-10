import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';

import SelectField from './SelectField';

describe('Select Field Component', () => {
  beforeEach(() => {
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
      'formcontainer.formcontrol'
    );
    expect(formControl).toHaveLength(1);
  });

  it('should render select field select input', async () => {
    const select = await screen.findAllByTestId('selectfield.select');
    expect(select).toHaveLength(1);
  });
});
