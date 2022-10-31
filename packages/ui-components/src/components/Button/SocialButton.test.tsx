import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';

import SocialButton from './SocialButton';

describe('Social Button Component', () => {
  beforeEach(() => {
    render(<SocialButton type="dribble" variant="solid" />);
  });

  it('should render social button for dribble ', async () => {
    const submitButton = await screen.findAllByTestId('dribble.social.btn');
    expect(submitButton).toHaveLength(1);
  });
});
describe('Social Button Component', () => {
  beforeEach(() => {
    render(<SocialButton type="twitter" variant="solid" />);
  });

  it('should render social button for twitter ', async () => {
    const submitButton = await screen.findAllByTestId('twitter.social.btn');
    expect(submitButton).toHaveLength(1);
  });
});
describe('Social Button Component', () => {
  beforeEach(() => {
    render(<SocialButton type="figma" variant="solid" />);
  });

  it('should render social button for figma ', async () => {
    const submitButton = await screen.findAllByTestId('figma.social.btn');
    expect(submitButton).toHaveLength(1);
  });
});
describe('Social Button Component', () => {
  beforeEach(() => {
    render(<SocialButton type="facebook" variant="solid" />);
  });

  it('should render social button for facebook ', async () => {
    const submitButton = await screen.findAllByTestId('facebook.social.btn');
    expect(submitButton).toHaveLength(1);
  });
});
describe('Social Button Component', () => {
  beforeEach(() => {
    render(<SocialButton type="apple" variant="solid" />);
  });

  it('should render social button for apple ', async () => {
    const submitButton = await screen.findAllByTestId('apple.social.btn');
    expect(submitButton).toHaveLength(1);
  });
});
describe('Social Button Component', () => {
  beforeEach(() => {
    render(<SocialButton type="google" variant="solid" />);
  });

  it('should render social button for google ', async () => {
    const submitButton = await screen.findAllByTestId('google.social.btn');
    expect(submitButton).toHaveLength(1);
  });
});
