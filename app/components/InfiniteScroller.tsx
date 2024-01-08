import { ReactNode, useCallback, useEffect, useRef } from "react";

interface LocalProps {
  children: ReactNode;
  isLoading: boolean;
  shouldFetch: boolean;
  loadNext: () => void;
}

export const InfiniteScroller = (props: LocalProps) => {
  const { children, isLoading, shouldFetch, loadNext } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollListener = useRef(loadNext);

  useEffect(() => {
    scrollListener.current = loadNext;
  }, [loadNext]);

  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const scrollTop = container.scrollTop;
    const scrollHeight = container.scrollHeight;
    const clientHeight = container.clientHeight;
    const scrollEnded = scrollTop + clientHeight >= scrollHeight - 100;

    if (!shouldFetch) return;
    if (isLoading) return;

    if (scrollEnded) {
      scrollListener.current();
    }
  }, [isLoading, shouldFetch]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);

      return () => {
        container.removeEventListener("scroll", handleScroll);
      };
    }
  }, [handleScroll]);

  return (
    <div
      ref={containerRef}
      className="hide-scrollbar px-6 py-12 xl:px-24 2xl:px-40 lg:py-4 xl:py-10 overflow-y-auto"
    >
      {children}
    </div>
  );
};
