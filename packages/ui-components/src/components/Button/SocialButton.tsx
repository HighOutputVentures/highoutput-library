import {
  Button,
  ButtonProps,
  IconButton,
  IconButtonProps,
} from '@chakra-ui/react';
import React from 'react';
import AppleIcon from '../../icons/AppleIcon';
import DribbleIcon from '../../icons/DribbleIcon';
import FacebookIcon from '../../icons/FacebookIcon';
import FigmaIcon from '../../icons/FigmaIcon';
import GoogleIcon from '../../icons/GoogleIcon';
import TwitterIcon from '../../icons/TwitterIcon';

export interface SocialButtonProps {
  buttonProps?: ButtonProps;
  onClicked?: () => void;
  type: 'google' | 'dribble' | 'twitter' | 'figma' | 'facebook' | 'apple';
  buttonText?: string;
  variant: 'outline' | 'solid';
  iconButtonProps?: IconButtonProps;
}

const SocialButton = (props: Omit<SocialButtonProps, 'children'>) => {
  const {
    buttonProps,

    type,
    variant,
    iconButtonProps,
    buttonText,
    onClicked,
  } = props;

  const useIcon = () => {
    switch (type) {
      case 'apple':
        return (
          <AppleIcon isDisabled={buttonProps?.disabled} variant={variant} />
        );

      case 'dribble':
        return (
          <DribbleIcon isDisabled={buttonProps?.disabled} variant={variant} />
        );
      case 'facebook':
        return (
          <FacebookIcon isDisabled={buttonProps?.disabled} variant={variant} />
        );

      case 'figma':
        return <FigmaIcon isDisabled={buttonProps?.disabled} />;

      case 'google':
        return <GoogleIcon isDisabled={buttonProps?.disabled} />;
      case 'twitter':
        return (
          <TwitterIcon isDisabled={buttonProps?.disabled} variant={variant} />
        );
    }
  };

  const defaultStyle = {
    google: {
      border: '1px solid #D0D5DD',
      bg: variant === 'outline' ? 'white' : 'white',
      color: 'black',
      borderRadius: '4px',
      fontSize: '18px',
      fontWeight: 500,
      fontFamily: 'Helvetica Neue',
      boxShadow: '0px 1px 2px rgba(16, 24, 40, 0.05)',
      _hover: {
        bg: variant === 'outline' ? 'white' : '#F9FAFB',
        boxShadow: '0px 1px 2px rgba(16, 24, 40, 0.05)',
        _disabled: {
          bg: 'none',
          boxShadow: 'none',
        },
      },
      _active: {
        bg: variant === 'outline' ? 'white' : 'white',
        border: '1px solid #D0D5DD',
        boxShadow:
          '0px 1px 2px rgba(16, 24, 40, 0.05), 0px 0px 0px 4px #F2F4F7',
      },
    },
    facebook: {
      border: '1px solid #D0D5DD',
      bg: variant === 'outline' ? 'white' : '#1877F2',
      color: variant === 'outline' ? 'black' : 'white',
      borderRadius: '4px',
      fontSize: '18px',
      fontWeight: 500,
      fontFamily: 'Helvetica Neue',
      boxShadow: '0px 1px 2px rgba(16, 24, 40, 0.05)',
      _hover: {
        bg: variant === 'outline' ? 'white' : '#0C63D4',
        boxShadow: '0px 1px 2px rgba(16, 24, 40, 0.05)',
        _disabled: {
          bg: 'none',
          boxShadow: 'none',
        },
      },
      _active: {
        bg: variant === 'outline' ? 'white' : '#1877F2',
        border: '1px solid #D0D5DD',
        boxShadow:
          '0px 1px 2px rgba(16, 24, 40, 0.05), 0px 0px 0px 4px #F2F4F7',
      },
    },
    figma: {
      border: '1px solid #D0D5DD',
      bg: variant === 'outline' ? 'white' : '#000000',
      color: variant === 'outline' ? 'black' : 'white',
      borderRadius: '4px',
      fontSize: '18px',
      fontWeight: 500,
      fontFamily: 'Helvetica Neue',
      boxShadow: '0px 1px 2px rgba(16, 24, 40, 0.05)',
      _hover: {
        bg: variant === 'outline' ? 'white' : '#000000',
        boxShadow: '0px 1px 2px rgba(16, 24, 40, 0.05)',
        _disabled: {
          bg: 'none',
          boxShadow: 'none',
        },
      },
      _active: {
        bg: variant === 'outline' ? 'white' : '#000000',
        border: '1px solid #D0D5DD',
        boxShadow:
          '0px 1px 2px rgba(16, 24, 40, 0.05), 0px 0px 0px 4px #F2F4F7',
        _disabled: {
          bg: 'none',
          boxShadow: 'none',
        },
      },
    },
    apple: {
      border: '1px solid #D0D5DD',
      bg: variant === 'outline' ? 'white' : '#000000',
      color: variant === 'outline' ? 'black' : 'white',
      borderRadius: '4px',
      fontSize: '18px',
      fontWeight: 500,
      fontFamily: 'Helvetica Neue',
      boxShadow: '0px 1px 2px rgba(16, 24, 40, 0.05)',
      _hover: {
        bg: variant === 'outline' ? 'white' : '#000000',
        boxShadow: '0px 1px 2px rgba(16, 24, 40, 0.05)',
        _disabled: {
          bg: 'none',
          boxShadow: 'none',
        },
      },
      _active: {
        bg: variant === 'outline' ? 'white' : '#000000',
        border: '1px solid #D0D5DD',
        boxShadow:
          '0px 1px 2px rgba(16, 24, 40, 0.05), 0px 0px 0px 4px #F2F4F7',
      },
    },
    dribble: {
      border: '1px solid #D0D5DD',
      bg: variant === 'outline' ? 'white' : '#EA4C89',
      color: variant === 'outline' ? 'black' : 'white',
      borderRadius: '4px',
      fontSize: '18px',
      fontWeight: 500,
      fontFamily: 'Helvetica Neue',
      boxShadow: '0px 1px 2px rgba(16, 24, 40, 0.05)',
      _hover: {
        bg: variant === 'outline' ? 'white' : '#EA4C89',
        boxShadow: '0px 1px 2px rgba(16, 24, 40, 0.05)',
        _disabled: {
          bg: 'none',
          boxShadow: 'none',
        },
      },
      _active: {
        bg: variant === 'outline' ? 'white' : '#E62872',
        border: '1px solid #D0D5DD',
        boxShadow:
          '0px 1px 2px rgba(16, 24, 40, 0.05), 0px 0px 0px 4px #F2F4F7',
      },
    },
    twitter: {
      border: '1px solid #D0D5DD',
      bg: variant === 'outline' ? 'white' : '#1DA1F2',
      color: variant === 'outline' ? 'black' : 'white',
      borderRadius: '4px',
      fontSize: '18px',
      fontWeight: 500,
      fontFamily: 'Helvetica Neue',
      boxShadow: '0px 1px 2px rgba(16, 24, 40, 0.05)',
      _hover: {
        bg: variant === 'outline' ? 'white' : '#0C63D4',
        boxShadow: '0px 1px 2px rgba(16, 24, 40, 0.05)',
        _disabled: {
          bg: 'none',
          boxShadow: 'none',
        },
      },
      _active: {
        bg: variant === 'outline' ? 'white' : '#0C8BD9',
        boxShadow:
          '0px 1px 2px rgba(16, 24, 40, 0.05), 0px 0px 0px 4px #F2F4F7',
      },
    },
  };

  return (
    <>
      {buttonText ? (
        <Button
          p="10px 16px"
          height={'44px'}
          {...defaultStyle[`${type}`]}
          leftIcon={useIcon()}
          variant={variant}
          {...buttonProps}
          data-testid={`${type}.social.btn`}
          onClick={onClicked}
        >
          {buttonText}
        </Button>
      ) : (
        <IconButton
          {...defaultStyle[`${type}`]}
          width={'44px'}
          height={'44px'}
          data-testid={`${type}.social.btn`}
          aria-label={`btn-${useIcon()}`}
          disabled={props.buttonProps?.disabled}
          icon={useIcon()}
          {...iconButtonProps}
          onClick={onClicked}
        />
      )}
    </>
  );
};

export default SocialButton;
