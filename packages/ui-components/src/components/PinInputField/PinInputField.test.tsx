import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';

import PinInputField from './PinInputField';

describe('Input Field Component', () => {
  beforeEach(() => {
    render(
      <PinInputField
        name="input"
        onBlur={async () => console.log('change')}
        onChange={async () => console.log('change')}
      />
    );
  });

  it('should renders pin input field form container', async () => {
    const formControl = await screen.findAllByTestId(
      'formcontainer.formcontrol'
    );
    expect(formControl).toHaveLength(1);
  });
});
