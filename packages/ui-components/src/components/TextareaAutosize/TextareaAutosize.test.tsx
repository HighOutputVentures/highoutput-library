import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import * as React from 'react';
import TextareaAutosize from './TextareaAutosize';

describe('Textarea Autosize', () => {
  beforeEach(() => {
    render(<TextareaAutosize mt="2rem" pt="4rem" />);
  });

  it('Should have correct value', () => {
    const input = screen.getByTestId<HTMLTextAreaElement>(/textarea-autosize/i);
    const value = Date.now().toString();
    fireEvent.change(input, { target: { value } });
    expect(input.value).toBe(value);
  });

  it('Should be styleable', () => {
    const input = screen.getByTestId<HTMLTextAreaElement>(/textarea-autosize/i);

    expect(input).toHaveStyle({
      'margin-top': '2rem',
      'padding-top': '4rem',
    });
  });
});
