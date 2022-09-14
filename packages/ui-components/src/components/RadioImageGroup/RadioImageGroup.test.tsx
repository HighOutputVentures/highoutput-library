import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';

import RadioImageGroup from './RadioImageGroup';
import { Default as RadioImageGroupComponent } from './RadioImageGroup.stories';

describe('Radio Image Group', () => {
  beforeEach(() => {
    render(
      <RadioImageGroup
        avatars={[
          {
            value: 'Kat',
            image: 'https://randomuser.me/api/portraits/women/44.jpg',
          },
          {
            value: 'Kevin',
            image: 'https://randomuser.me/api/portraits/men/86.jpg',
          },
          {
            value: 'Andy',
            image: 'https://randomuser.me/api/portraits/men/29.jpg',
          },
          {
            value: 'Jess',
            image: 'https://randomuser.me/api/portraits/women/95.jpg',
          },
        ]}
        onChange={jest.fn}
      />
    );
  });

  it('should renders radio image stack container', async () => {
    const radioImageBoxGroupStack = await screen.findAllByTestId(
      /radio-image-group-stack-container/i
    );
    expect(radioImageBoxGroupStack).toHaveLength(1);
  });

  it('should renders radio image horizontal stack', async () => {
    const radioImageBoxGroupStack = await screen.findAllByTestId(
      /radio-image-group-horizontal-stack/i
    );
    expect(radioImageBoxGroupStack).toHaveLength(1);
  });

  it('should render 4 radio image box', async () => {
    const radioImageBox = await screen.findAllByTestId(/radio-image-box/i);
    expect(radioImageBox).toHaveLength(4);
  });

  it('should render 4 radio image container', async () => {
    const radioImageContainer = await screen.findAllByTestId(
      /radio-image-container/i
    );
    expect(radioImageContainer).toHaveLength(4);
  });
});

describe('Storybook - Radio Image Group', () => {
  beforeEach(() => {
    render(
      <RadioImageGroupComponent
        avatars={[
          {
            value: 'Kat',
            image: 'https://randomuser.me/api/portraits/women/44.jpg',
          },
          {
            value: 'Kevin',
            image: 'https://randomuser.me/api/portraits/men/86.jpg',
          },
          {
            value: 'Andy',
            image: 'https://randomuser.me/api/portraits/men/29.jpg',
          },
          {
            value: 'Jess',
            image: 'https://randomuser.me/api/portraits/women/95.jpg',
          },
        ]}
        onChange={jest.fn}
      />
    );
  });

  it('should renders radio image stack container', async () => {
    const radioImageBoxGroupStack = await screen.findAllByTestId(
      /radio-image-group-stack-container/i
    );
    expect(radioImageBoxGroupStack).toHaveLength(1);
  });

  it('should renders radio image horizontal stack', async () => {
    const radioImageBoxGroupStack = await screen.findAllByTestId(
      /radio-image-group-horizontal-stack/i
    );
    expect(radioImageBoxGroupStack).toHaveLength(1);
  });

  it('should render 4 radio image box', async () => {
    const radioImageBox = await screen.findAllByTestId(/radio-image-box/i);
    expect(radioImageBox).toHaveLength(4);
  });

  it('should render 4 radio image container', async () => {
    const radioImageContainer = await screen.findAllByTestId(
      /radio-image-container/i
    );
    expect(radioImageContainer).toHaveLength(4);
  });
});
