import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';

import FormContainer from './FormContainer';

describe('Form Container Component', () => {
  beforeEach(() => {
    render(<FormContainer id="test" children={<>test</>} />);
  });

  it('should renders  form container', async () => {
    const formControl = await screen.findAllByTestId(
      'formcontainer.formcontrol'
    );
    expect(formControl).toHaveLength(1);
  });
});
