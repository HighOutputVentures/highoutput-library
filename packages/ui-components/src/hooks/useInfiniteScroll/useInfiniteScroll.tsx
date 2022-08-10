type Nullable<T> = T | null;

type InfiniteScrollDirection = 'x' | 'y';

type InfiniteScrollConfig = {
  target: Nullable<HTMLElement>;
  direction: InfiniteScrollDirection;
  onLoadMore: () => void;
  /** this pauses calling `loadMore` when fetching more data from API */
  loading?: boolean;
};

export default function useInfiniteScroll() {
  return infiniteScroll;
}

/**
 *
 * @example
 * const infiniteScroll = useInfiniteScroll()
 * const targetRef = useRef<HTMLDivElement>(null)
 * const [loading, setLoading] = useState(false)
 *
 * const fetchTodos = useCallback(async () => {
 *  setLoading(true)
 *
 *  try {
 *    ...
 *  } catch (e) {
 *    ...
 *  } finally {
 *    setLoading(false)
 *  }
 * }, [])
 *
 * useEffect(() => {
 *  const target = targetRef.current()
 *
 *  if (!target) return
 *
 *  const unsubscribe = infiniteScroll(() => {
 *    target,
 *    loading,
 *    direction: "x", // "x" | "y"
 *    onLoadMore() {
 *      fetchTodos()
 *    },
 *  })
 *
 *  // cleanup
 *  return () => unsubscribe()
 * }, [infiniteScroll, fetchTodos])
 *
 */
function infiniteScroll({
  target,
  direction,
  loading,
  onLoadMore,
}: InfiniteScrollConfig) {
  const handleScroll = () => {
    if (!target) return;

    const hitsBoundary =
      (direction === 'x' && isScrolledToLeft(target)) ||
      (direction === 'y' && isScrolledToTop(target));

    const shouldLoadMore =
      hitsBoundary &&
      // pause loadMore calls when still loading or fetching data
      !loading;

    if (shouldLoadMore) onLoadMore?.();
  };

  target?.addEventListener('scroll', handleScroll);
  return () => target?.removeEventListener('scroll', handleScroll);
}

function isScrolledToLeft(target: HTMLElement) {
  return target.scrollLeft === target.scrollWidth - target.offsetWidth;
}

function isScrolledToTop(target: HTMLElement) {
  return target.scrollTop === target.scrollHeight - target.offsetHeight;
}
