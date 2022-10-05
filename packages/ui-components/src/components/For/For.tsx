import * as React from 'react';
import { Fragment } from 'react';

export type ForProps<T extends unknown[]> = {
  each: T;
  getKey?: (context: T[number], index: number) => string | number;
  children: (context: T[number], index: number) => JSX.Element;
  fallback?: JSX.Element | null;
};

export default function For<T extends unknown[]>(props: ForProps<T>) {
  const { each, fallback, children, getKey } = Object.assign(
    defaultProps,
    props
  );

  if (!each.length) return fallback;

  return (
    <Fragment>
      {each.map((value, index) => {
        const Item = () => children(value, index);

        return <Item key={getKey(value, index)} />;
      })}
    </Fragment>
  );
}

const defaultProps = {
  fallback: null,
  getKey(_: unknown, index: number) {
    return index;
  },
};
