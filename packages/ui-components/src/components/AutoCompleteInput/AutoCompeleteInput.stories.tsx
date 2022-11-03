import { useArgs } from '@storybook/addons';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import { Flex, ThemeProvider } from '../..';
import AutoCompleteInput from './AutoCompleteInput';

export default {
  title: 'Components/Form/Auto Complete Input',
  component: AutoCompleteInput,
} as ComponentMeta<typeof AutoCompleteInput>;

const Template: ComponentStory<typeof AutoCompleteInput> = props => {
  const [args, setArgs] = useArgs();

  const onChange = (value: any[]) => {
    setArgs({ ...args, value });
  };

  return (
    <ThemeProvider>
      <Flex gap={4} flexDir="column">
        <AutoCompleteInput
          {...props}
          onChangeValue={onChange}
          options={args.options}
          helperMsg="This is a hint to help user"
        />
        <AutoCompleteInput
          {...props}
          onChangeValue={onChange}
          multiple
          value={options.map(item => item.value)}
          options={args.options}
          helperMsg="This is a hint to help user"
        />
        <AutoCompleteInput
          {...props}
          onChangeValue={onChange}
          multiple
          value={options.map(item => item.value)}
          options={args.options}
          helperMsg="This is a hint to help user"
        />
        <AutoCompleteInput
          {...props}
          onChangeValue={onChange}
          multiple
          disabled
          value={options.map(item => item.value)}
          options={args.options}
          helperMsg="This is a hint to help user"
        />
        <AutoCompleteInput
          {...props}
          onChangeValue={onChange}
          multiple
          value={options.map(item => item.value)}
          options={args.options}
          errorMsg="This is an error message"
        />
      </Flex>
    </ThemeProvider>
  );
};

export const Default = Template.bind({});

const options = [
  {
    value: 'Phoenix',
    label: 'Phoenix',
    avatar:
      'https://assets.teenvogue.com/photos/626abe370979f2c5ace0ab29/16:9/w_2560%2Cc_limit/GettyImages-1352932505.jpg',
  },
  {
    value: 'Olivia',
    label: 'Olivia',
    avatar:
      'https://static01.nyt.com/images/2021/05/21/arts/21review-rodrigo01/merlin_188054001_2a34e77d-e653-488a-a4d9-1a0f1ddf73e4-superJumbo.jpg',
  },
];

Default.args = {
  ...Default.args,
  label: 'Users',
  options: options,
  placeholder: 'Add users',
};
