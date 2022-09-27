import * as React from 'react';

export type MountProps = {
  when?: boolean;
  fallback?: JSX.Element | null;
};

export default function Mount(props: React.PropsWithChildren<MountProps>) {
  const { when, fallback, children } = Object.assign({ fallback: null }, props);

  return !when ? fallback : <React.Fragment>{children}</React.Fragment>;
}
