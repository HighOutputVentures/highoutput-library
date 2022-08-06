import { HStack, Stack, ThemingProps, useRadioGroup } from '@chakra-ui/react';
import React, { FC } from 'react';

import RadioImage from '../RadioImage/RadioImage';

export interface RadioImageGroupProps extends ThemingProps {
  avatars: Array<{ value: string; image: string }>;
  onChange: (value: string) => void;
  defaultValue?: string;
}

const RadioImageGroup: FC<RadioImageGroupProps> = ({
  avatars,
  onChange,
  defaultValue,
}) => {
  const { getRadioProps, getRootProps } = useRadioGroup({
    defaultValue: defaultValue || '',
    onChange: onChange,
  });

  return (
    <Stack {...getRootProps()} data-testid="radio.image.group.stack.container">
      <HStack data-testid="radio.image.group.horizontal.stack">
        {avatars.map((avatar) => {
          return (
            <RadioImage
              key={avatar.value}
              image={avatar.image}
              {...getRadioProps({ value: avatar.value })}
            />
          );
        })}
      </HStack>
    </Stack>
  );
};

export default RadioImageGroup;
