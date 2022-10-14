import { BoxProps, chakra, Flex, FlexProps } from '@chakra-ui/react';
import { isValidMotionProp, motion, SVGMotionProps } from 'framer-motion';
import * as React from 'react';

type WithoutChildren<T> = Omit<T, 'children'>;
type LogoSpinnerProps = {
  logo?: JSX.Element;
  duration?: number;
  partProps?: Partial<{
    container?: WithoutChildren<FlexProps>;
    wrapper?: WithoutChildren<FlexProps>;
    square1?: WithoutChildren<BoxProps>;
    square2?: WithoutChildren<BoxProps>;
    logo?: WithoutChildren<SVGMotionProps<SVGSVGElement>>;
  }>;
};

/**
 *
 * @example
 * <LogoSpinner duration={1500}>
 *    <div>Hello, World!</div>
 * </LogoSpinner>
 */
export default function LogoSpinner({
  logo,
  duration = 1000,
  partProps,
  children,
}: React.PropsWithChildren<LogoSpinnerProps>) {
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, duration ?? 100);
  }, [duration]);

  if (!loading) return <React.Fragment>{children}</React.Fragment>;

  return (
    <Container {...partProps?.container}>
      <Flex
        position="relative"
        w="200px"
        h="200px"
        align="center"
        justify="center"
        {...partProps?.wrapper}
      >
        <BoxMotion
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
            repeat: Infinity,
          }}
          {...partProps?.square1}
        />

        <BoxMotion
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
            repeat: Infinity,
          }}
          {...partProps?.square2}
        />

        {!logo ? <DefaultLogo {...partProps?.logo} /> : <>{logo}</>}
      </Flex>
    </Container>
  );
}

const Container = ({ children, ...props }: FlexProps) => {
  return (
    <Flex
      top={0}
      left={0}
      align="center"
      justify="center"
      width="100vw"
      height="100vh"
      zIndex={1_000_000}
      position="fixed"
      bgColor="rgba(15,15,15,1)"
      {...props}
    >
      {children}
    </Flex>
  );
};

function DefaultLogo(props: SVGMotionProps<SVGSVGElement>) {
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
        repeat: Infinity,
      }}
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M0 32L3.55556 28.4444V32H0ZM14.2222 32V26.6667L10.6667 30.2222V32H7.11111V24.8889L10.6667 21.3333V24.8889V26.6667L14.2222 23.1111V17.7778L17.7778 14.2222V17.7778V24.8889V32H14.2222ZM28.4444 17.7778V10.6667V7.11111L24.8889 10.6667V17.7778V28.4444H28.4444V17.7778ZM28.4444 32H24.8889H21.3333V17.7778V10.6667L24.8889 7.11111L28.4444 3.55556L32 0V3.55556V10.6667V17.7778V32H28.4444Z"
        fill="#4d4d4d"
      />
    </motion.svg>
  );
}

const BoxMotion = chakra(motion.div, {
  shouldForwardProp: prop => isValidMotionProp(prop) || prop === 'children',
});
