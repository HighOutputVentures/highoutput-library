import { CloseIcon, IconProps } from '@chakra-ui/icons';
import {
  Button,
  ButtonProps,
  ComponentWithAs,
  Icon,
  ThemingProps,
} from '@chakra-ui/react';
import React from 'react';

type WithoutChildren<T> = Omit<T, 'children'>;
export interface CloseButtonPartProps {
  button?: WithoutChildren<ButtonProps>;
}
export interface CloseButtonProps {
  icon?: ComponentWithAs<'svg', IconProps>;
  onClicked?: () => void;
  variant?: ThemingProps<'Button'>['variant'];
  size?: ThemingProps<'Button'>['size'];
  partProps?: Partial<CloseButtonPartProps>;
}

const CloseButton = (props: Omit<CloseButtonProps, 'children'>) => {
  const { partProps, icon, variant, size, onClicked } = props;

  return (
    <Button
      size={size ?? 'button-close-sm'}
      variant={variant ?? 'solid-close-btn'}
      {...partProps?.button}
      data-testid="close.btn"
      onClick={onClicked}
    >
      <Icon as={icon ?? CloseIcon} />
    </Button>
  );
};

export default CloseButton;
