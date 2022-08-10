import { cleanup, render } from '@testing-library/react';
import * as React from 'react';
import useInfiniteScroll from './useInfiniteScroll';

const infiniteScroll = jest.fn().mockReturnValue(jest.fn());
const callback = {
  loadMore() {},
};

Object.defineProperty(window.Element.prototype, 'scrollTo', {
  writable: true,
  value: jest.fn(() => {
    callback.loadMore();
  }),
});

jest.mock('./useInfiniteScroll', () => {
  return {
    __esModule: true,
    default: jest.fn(() => {
      return infiniteScroll;
    }),
  };
});

describe('Infinite Scroll', () => {
  afterEach(cleanup);

  beforeEach(() => {
    render(<Component />);
  });

  it('should be able to pass props', () => {
    expect(infiniteScroll).toBeCalledWith(
      expect.objectContaining({
        target: expect.any(HTMLDivElement),
        direction: expect.any(String),
        onLoadMore: expect.any(Function),
      })
    );
  });

  it('should be able to call loadMore', () => {
    jest.spyOn(callback, 'loadMore');
    document.querySelector('div')?.scrollTo({ top: 1000 });
    expect(callback.loadMore).toHaveBeenCalled();
  });
});

function Component() {
  const infiniteScroll = useInfiniteScroll();
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const target = ref.current;

    if (!target) return;

    const unsubscribe = infiniteScroll({
      target,
      direction: 'y',
      onLoadMore: callback.loadMore,
    });

    return () => unsubscribe();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        width: '100px',
        height: '10px',
        overflowY: 'auto',
      }}
    >
      Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sequi facere
      placeat, animi odit minus officiis nemo fugiat, illum, quisquam doloremque
      assumenda ex harum dolor eligendi quasi dignissimos! Aspernatur dolor
      optio blanditiis eaque perspiciatis, ipsa sint iusto nam debitis commodi
      ad atque nisi nemo totam veritatis. Nam natus cupiditate quas quaerat.
    </div>
  );
}
