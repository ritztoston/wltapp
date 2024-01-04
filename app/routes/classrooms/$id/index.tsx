import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
  json,
} from "@remix-run/node";
import { useState } from "react";

import { ClassCode } from "~/components/Classrooms/Classroom/ClassCode";
import { Feeds } from "~/components/Classrooms/Classroom/Feeds";
import { PostButton } from "~/components/Classrooms/Classroom/PostButton";
import { PostField } from "~/components/Classrooms/Classroom/PostField";
import { Sidebar } from "~/components/Classrooms/Classroom/Sidebar";
import { Content } from "~/components/Content";
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

  const [user, classroom] = await Promise.all([
    authenticate(request),
    getClassroom(id),
  ]);

  if (!classroom) throw json({ error: "Classroom not found" }, 404);

  return json({ user, classroom });
};

export default function ClassroomPage() {
  const { user, classroom } = useLiveLoader<typeof loader>();
  const [openPostDialog, setPostDialog] = useState(false);
  const [notification, setNotification] = useState<Snackbar | null>(null);

  return (
    <Content
      title={classroom.name}
      notification={notification}
      sidebar={<Sidebar classroom={classroom} />}
    >
      <div className="grid grid-cols-9 gap-4">
        <div className="col-span-9 sm:col-span-3 xl:col-span-2 rounded-lg">
          <ClassCode classroom={classroom} setNotification={setNotification} />
        </div>
        <div className="col-span-9 sm:col-span-6 xl:col-span-7 flex flex-col gap-y-4">
          <PostButton state={[openPostDialog, setPostDialog]} user={user} />
          <Feeds posts={classroom.posts} />
        </div>
      </div>
      <PostField state={[openPostDialog, setPostDialog]} />
    </Content>
  );
}
