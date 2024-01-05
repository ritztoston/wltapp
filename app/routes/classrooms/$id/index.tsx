import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
  json,
} from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { useEffect, useState } from "react";

import { ClassCode } from "~/components/Classrooms/Classroom/ClassCode";
import { Feeds } from "~/components/Classrooms/Classroom/Feeds";
import { PostButton } from "~/components/Classrooms/Classroom/PostButton";
import { PostField } from "~/components/Classrooms/Classroom/PostField";
import { Sidebar } from "~/components/Classrooms/Classroom/Sidebar";
import { Content } from "~/components/Content";
import { InfiniteScroller } from "~/components/InfiniteScroller";
import { emitter } from "~/emitter.server";
import { getClassroom } from "~/models/classroom.server";
import { createPost } from "~/models/post.server";
import { capitalize } from "~/utilities";
import { authenticate } from "~/utilities/auth";
import { Snackbar } from "~/utilities/types";
import { useLiveLoader } from "~/utilities/useLiveLoader";

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
  if (!id) throw json({ error: "No classroom name provided" }, 404);

  const user = await authenticate(request);
  const formData = await request.formData();
  const comment = formData.get("comment") as string;

  const result = await createPost(comment, id, user.id);

  if (!result) {
    return json({ success: false, error: result });
  }

  emitter.emit(id);
  return json({ success: true, result, error: {} });
};

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const id = params.id;
  if (!id) throw json({ error: "No classroom ID provided" }, 404);

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
  const [notification, setNotification] = useState<Snackbar | null>(null);
  const [shouldFetch, setShouldFetch] = useState(true);
  const [posts, setPosts] = useState([...classroom.posts]);

  useEffect(() => {
    // set posts again when the classroom page changes
    // it's a hacky way to make sure the posts are updated
    // for some reason the posts are not updated when the classroom page changes
    setPosts([...classroom.posts]);

    // set refetch to true when adding a new post
    setShouldFetch(true);
  }, [classroom.posts]);

  useEffect(() => {
    if (fetcher.data && fetcher.data.classroom.posts.length === 0) {
      return setShouldFetch(false);
    }

    if (fetcher.data && fetcher.data.classroom.posts.length > 0) {
      const newItems = fetcher.data.classroom.posts;
      setPosts((x) => [...newItems, ...x]);
      setShouldFetch(true);
    }
  }, [fetcher.data]);

  return (
    <Content
      title={classroom.name}
      notification={notification}
      sidebar={<Sidebar classroom={classroom} />}
      isInfiniteScrolling
    >
      <InfiniteScroller
        loadNext={() => {
          fetcher.load("?cursor=".concat(posts[0].id));
          setShouldFetch(false);
        }}
        isLoading={isLoading}
        shouldFetch={shouldFetch}
      >
        <div className="grid grid-cols-9 gap-4">
          <div className="col-span-9 sm:col-span-3 xl:col-span-2 rounded-lg">
            <ClassCode
              classroom={classroom}
              setNotification={setNotification}
            />
          </div>
          <div className="col-span-9 sm:col-span-6 xl:col-span-7 flex flex-col gap-y-4">
            <PostButton state={[openPostDialog, setPostDialog]} user={user} />
            <Feeds posts={posts} isLoading={isLoading} />
          </div>
        </div>
        <PostField state={[openPostDialog, setPostDialog]} />
      </InfiniteScroller>
    </Content>
  );
}
