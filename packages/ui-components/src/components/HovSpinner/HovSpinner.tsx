import { Box, BoxProps, chakra, Flex } from '@chakra-ui/react';
import { isValidMotionProp, motion } from 'framer-motion';
import * as React from 'react';

type HovSpinnerProps = {
  duration?: number;
};

/**
 *
 * @example
 * <HovSpinner duration={1500}>
 *    <div>Hello, World!</div>
 * </HovSpinner>
 */
export default function HovSpinner({
  duration = 1000,
  children,
}: React.PropsWithChildren<HovSpinnerProps>) {
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, duration);
  }, [duration]);

  if (loading) return <Spinner />;

  return <React.Fragment>{children}</React.Fragment>;
}

function Spinner() {
  return (
    <Container>
      <Flex
        position="relative"
        w="200px"
        h="200px"
        align="center"
        justify="center"
      >
        <MotionBox
          width="125px"
          height="125px"
          position="absolute"
          border="2px solid"
          borderColor="#32CAB1"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.25, 1],
            opacity: [0, 1, 0],
          }}
          initial={{ opacity: 0 }}
          // @ts-ignore "Bug"
          transition={{
            duration: 4,
            loop: Infinity,
          }}
        />

        <MotionBox
          width="100px"
          height="100px"
          position="absolute"
          border="2px solid"
          borderColor="#7070DD"
          animate={{
            rotate: [360, 0],
            scale: [1, 1.25, 1],
            opacity: [0, 1, 0],
          }}
          initial={{ opacity: 0 }}
          // @ts-ignore "Bug"
          transition={{
            duration: 3,
            loop: Infinity,
          }}
        />

        <HovLogo />
      </Flex>
    </Container>
  );
}

function HovLogo() {
  return (
    <motion.svg
      animate={{
        scale: [1, 1.5, 1.5, 1],
        opacity: [0.5, 1, 1, 0.5],
      }}
      initial={{ opacity: 0 }}
      // @ts-ignore "Bug"
      transition={{
        duration: 3,
        loop: Infinity,
      }}
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0 32L3.55556 28.4444V32H0ZM14.2222 32V26.6667L10.6667 30.2222V32H7.11111V24.8889L10.6667 21.3333V24.8889V26.6667L14.2222 23.1111V17.7778L17.7778 14.2222V17.7778V24.8889V32H14.2222ZM28.4444 17.7778V10.6667V7.11111L24.8889 10.6667V17.7778V28.4444H28.4444V17.7778ZM28.4444 32H24.8889H21.3333V17.7778V10.6667L24.8889 7.11111L28.4444 3.55556L32 0V3.55556V10.6667V17.7778V32H28.4444Z"
        fill="#4d4d4d"
      />
    </motion.svg>
  );
}

function Container({ children, ...props }: BoxProps) {
  return (
    <Box
      sx={{
        top: 0,
        left: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100vw',
        height: '100vh',
        zIndex: 1_000_000,
        position: 'fixed',
        bgColor: 'rgba(15,15,15,1)',
      }}
      {...props}
    >
      {children}
    </Box>
  );
}

const MotionBox = chakra(motion.div, {
  shouldForwardProp: isValidMotionProp,
});
