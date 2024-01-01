import {
  useLoaderData,
  useResolvedPath,
  useRevalidator,
} from "@remix-run/react";
import { useEffect } from "react";
import { useEventSource } from "remix-utils/sse/react";

export const useLiveLoader = <T>() => {
  const path = useResolvedPath("./stream");
  const data = useEventSource(path.pathname);

  const { revalidate } = useRevalidator();

  useEffect(() => {
    revalidate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return useLoaderData<T>();
};
