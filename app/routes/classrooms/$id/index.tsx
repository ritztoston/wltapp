import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
  json,
} from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { useCallback, useEffect, useState } from "react";

import { ClassCode } from "~/components/Classrooms/Classroom/ClassCode";
import { Feeds } from "~/components/Classrooms/Classroom/Feeds";
import { PostButton } from "~/components/Classrooms/Classroom/PostButton";
import { PostField } from "~/components/Classrooms/Classroom/PostField";
import { Sidebar } from "~/components/Classrooms/Classroom/Sidebar";
import { Content } from "~/components/Content";
import { InfiniteScroller } from "~/components/InfiniteScroller";
import { getClassroom } from "~/models/classroom.server";
import { deletePost, upsertPost } from "~/models/post.server";
import { authenticate } from "~/modules/auth0/auth";
import { emitter } from "~/modules/serverSentEvents/emitter.server";
import { useLiveLoader } from "~/modules/serverSentEvents/useLiveLoader";
import { Toast, setToast } from "~/modules/toasts/toast.server";
import { capitalize } from "~/utilities";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const classroom = data?.classroom;

  return [
    {
      title: `${
        classroom ? capitalize(classroom.name).concat(" | ") : ""
      }`.concat("ClassMaster"),
    },
  ];
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const id = params.id;
  if (!id)
    throw new Response(null, {
      status: 404,
      statusText: "No classroom ID provided",
    });

  const user = await authenticate(request);
  const formData = await request.formData();
  const comment = formData.get("comment") as string;
  const postId = formData.get("id") as string;

  if (request.method === "POST") {
    const result = await upsertPost(comment, id, user.id, postId ?? "");

    if (!result) {
      return json({ success: false, error: result });
    }

    emitter.emit(id);
    return json({ success: true, result, error: {} });
  }

  if (request.method === "DELETE") {
    const idToDelete = formData.get("idToDelete") as string;
    await deletePost(idToDelete);

    const toast: Toast = {
      message: "Post deleted",
      type: "success",
      key: new Date().toISOString(),
    };

    const headers = await setToast(toast);
    emitter.emit(id);
    return json({ success: true, error: {}, headers });
  }
};

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const id = params.id;
  if (!id)
    throw new Response(null, {
      status: 404,
      statusText: "No classroom ID provided",
    });

  const url = new URL(request.url);
  const cursor = url.searchParams.get("cursor");

  const user = await authenticate(request);
  const classroom = await getClassroom(id, user.id, cursor);

  return json({ user, classroom });
};

export default function ClassroomPage() {
  const { user, classroom } = useLiveLoader<typeof loader>();
  const fetcher = useFetcher<typeof loader>();
  const isLoading = fetcher.state === "loading";

  const [openPostDialog, setPostDialog] = useState(false);
  const [shouldFetch, setShouldFetch] = useState(true);
  const [selectedPost, setSelectedPost] = useState({ id: "", content: "" });

  useEffect(() => {
    // set re-fetch to posts when classroom data changes
    setShouldFetch(true);
  }, [classroom.posts]);

  useEffect(() => {
    if (fetcher.data && fetcher.data.classroom.posts.length > 0) {
      const newItems = fetcher.data.classroom.posts;
      classroom.posts = [...classroom.posts, ...newItems];
      setShouldFetch(true);
    }
  }, [classroom, fetcher.data]);

  const loadNextHandler = useCallback(() => {
    fetcher.load(
      "?cursor=".concat(classroom.posts[classroom.posts.length - 1].id),
    );
    setShouldFetch(false);
  }, [classroom.posts, fetcher]);

  return (
    <Content
      title={classroom.name}
      sidebar={<Sidebar classroom={classroom} />}
      isInfiniteScrolling
    >
      <InfiniteScroller
        loadNext={loadNextHandler}
        isLoading={isLoading}
        shouldFetch={shouldFetch}
      >
        <div className="grid grid-cols-9 gap-4">
          <div className="col-span-9 sm:col-span-3 xl:col-span-2 rounded-lg">
            <ClassCode classroom={classroom} />
          </div>
          <div className="col-span-9 sm:col-span-6 xl:col-span-7 flex flex-col gap-y-4">
            <PostButton
              state={[openPostDialog, setPostDialog, setSelectedPost]}
              user={user}
            />
            <Feeds
              posts={classroom.posts}
              isLoading={isLoading}
              state={[setPostDialog, setSelectedPost]}
            />
          </div>
        </div>
        <PostField
          state={[openPostDialog, setPostDialog]}
          post={selectedPost}
        />
      </InfiniteScroller>
    </Content>
  );
}
