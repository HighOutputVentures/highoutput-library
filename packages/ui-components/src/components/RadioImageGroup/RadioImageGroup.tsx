import { HStack, Stack, ThemingProps, useRadioGroup } from '@chakra-ui/react';
import React, { FC, useId } from 'react';

import RadioImage, { RadioImageProps } from '../RadioImage/RadioImage';

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
  const uid = useId();

  return (
    <Stack
      {...getRootProps()}
      data-testid={`${uid}-radio-image-group-stack-container`}
    >
      <HStack data-testid={`${uid}-radio-image-group-horizontal-stack`}>
        {avatars.map(avatar => {
          return (
            <RadioImage
              {...(getRadioProps({ value: avatar.value }) as RadioImageProps)}
              key={avatar.value}
              image={avatar.image}
            />
          );
        })}
      </HStack>
    </Stack>
  );
};

export default RadioImageGroup;
