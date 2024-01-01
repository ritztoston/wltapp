import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
  json,
} from "@remix-run/node";
import { Form, useLoaderData, useSubmit } from "@remix-run/react";
import { useRef } from "react";

import { Sidebar } from "~/components/Classrooms/Classroom/Sidebar";
import { Content } from "~/components/Content";
import { Feeds } from "~/components/Feeds";
import { TextAreaField } from "~/components/Fields/TextAreaField";
import { getClassroomByName } from "~/models/classroom.server";
import { createPost } from "~/models/post.server";
import { capitalize } from "~/utilities";
import { authenticate } from "~/utilities/auth";

export const meta: MetaFunction = ({ params }) => {
  const classroomName = params.id;
  if (!classroomName) return [{ title: "Classroom" }];
  return [{ title: `Classroom | ${capitalize(classroomName)}` }];
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const user = await authenticate(request);
  const formData = await request.formData();

  const id = formData.get("id") as string;
  const comment = formData.get("comment") as string;

  const result = await createPost(comment, id, user.id);

  if (!result) {
    return json({ success: false, error: result });
  }

  return json({ success: true, result, error: {} });
};

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const user = await authenticate(request);
  const classroomName = params.id;
  if (!classroomName) throw json({ error: "No classroom name provided" }, 404);

  const classroom = await getClassroomByName(classroomName);
  if (!classroom) throw json({ error: "Classroom not found" }, 404);

  return json({ user, classroom });
};

export default function ClassroomPage() {
  const { user, classroom } = useLoaderData<typeof loader>();
  const submit = useSubmit();

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleOnSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const comment = formData.get("comment") as string;

    // do nothing if the comment is empty
    if (!comment) return;

    // clear the content input field
    if (textAreaRef.current) {
      textAreaRef.current.value = "";
    }

    formData.set("id", classroom.id);
    submit(formData, { method: "post" });
  };

  return (
    <Content
      title={classroom.name}
      user={user}
      sidebar={<Sidebar classroom={classroom} />}
    >
      <Feeds posts={classroom.posts} />
      <Form method="post" onSubmit={handleOnSubmit}>
        <TextAreaField textAreaRef={textAreaRef} user={user} />
      </Form>
    </Content>
  );
}
