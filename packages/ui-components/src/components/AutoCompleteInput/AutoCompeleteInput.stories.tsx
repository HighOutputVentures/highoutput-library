import { useArgs } from '@storybook/addons';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import { ThemeProvider } from '../..';
import AutoCompleteInput from './AutoCompleteInput';

export default {
  title: 'Components/Form/Auto Complete Input',
  component: AutoCompleteInput,
} as ComponentMeta<typeof AutoCompleteInput>;

const Template: ComponentStory<typeof AutoCompleteInput> = props => {
  const [args, setArgs] = useArgs();

  const onChange = (value: any[]) => {
    console.log(value);
    setArgs({ ...args, value });
  };

  return (
    <ThemeProvider>
      <AutoCompleteInput
        {...props}
        onChangeValue={onChange}
        value={args.value}
        options={args.options}
      />
    </ThemeProvider>
  );
};

export const Default = Template.bind({});

const options = [
  {
    value: 'hello world',
    label: 'hello world',
    avatar:
      'https://assets.teenvogue.com/photos/626abe370979f2c5ace0ab29/16:9/w_2560%2Cc_limit/GettyImages-1352932505.jpg',
  },
  {
    value: 'hi world',
    label: 'hi world',
  },
];

Default.args = {
  ...Default.args,
  label: 'Users',
  errorMsg: 'this is an error message',
  options: options,
  value: [options[0].value],
};
