import React, { FC } from 'react';
import { Stack, HStack, useRadioGroup } from '@chakra-ui/react';

import HovRadioImage from '../HovRadioImage/HovRadioImage';

export interface HovRadioImageGroup {
  avatars: Array<{ value: string; image: string }>;
  onChange: (value: string) => void;
  defaultValue?: string;
}

const HovRadioImageGroup: FC<HovRadioImageGroup> = ({
  avatars,
  onChange,
  defaultValue,
}) => {
  const { getRadioProps, getRootProps } = useRadioGroup({
    defaultValue: defaultValue || '',
    onChange: onChange,
  });

  return (
    <Stack {...getRootProps()}>
      <HStack>
        {avatars.map(avatar => {
          return (
            <HovRadioImage
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
