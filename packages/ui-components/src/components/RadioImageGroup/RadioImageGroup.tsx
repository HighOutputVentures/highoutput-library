import React, { FC } from 'react';
import { Stack, HStack, useRadioGroup } from '@chakra-ui/react';

import RadioImage from '../RadioImage/RadioImage';

export interface RadioImageGroupProps {
  avatars: Array<{ value: string; image: string }>;
  onChange: (value: string) => void;
  defaultValue?: string;
}

const HovRadioImageGroup: FC<RadioImageGroupProps> = ({
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
        {avatars.map(avatar => {
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

export default HovRadioImageGroup;
