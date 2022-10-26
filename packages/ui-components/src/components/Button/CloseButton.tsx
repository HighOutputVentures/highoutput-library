import { CloseIcon, IconProps } from '@chakra-ui/icons';
import {
  Button,
  ButtonProps,
  ComponentWithAs,
  Icon,
  ThemingProps,
} from '@chakra-ui/react';
import React from 'react';

export interface CloseButtonProps {
  buttonProps?: ButtonProps;
  icon?: ComponentWithAs<'svg', IconProps>;
  onClicked?: () => void;
  variant?: ThemingProps<'Button'>['variant'];
  size?: ThemingProps<'Button'>['size'];
}

const CloseButton = (props: Omit<CloseButtonProps, 'children'>) => {
  const { buttonProps, icon, variant, size, onClicked } = props;

  return (
    <Button
      size={size ?? 'button-close-sm'}
      variant={variant ?? 'solid-close-btn'}
      {...buttonProps}
      data-testid="close.btn"
      onClick={onClicked}
    >
      <Icon as={icon ?? CloseIcon} />
    </Button>
  );
};

export default CloseButton;
