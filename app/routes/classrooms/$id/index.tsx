import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
  json,
} from "@remix-run/node";
import { Form, useSubmit } from "@remix-run/react";
import { useRef } from "react";

import { Feeds } from "~/components/Classrooms/Classroom/Feeds";
import { Sidebar } from "~/components/Classrooms/Classroom/Sidebar";
import { Content } from "~/components/Content";
import { TextAreaField } from "~/components/Fields/TextAreaField";
import { emitter } from "~/emitter.server";
import { getClassroom } from "~/models/classroom.server";
import { createPost } from "~/models/post.server";
import { capitalize } from "~/utilities";
import { authenticate } from "~/utilities/auth";
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
  await authenticate(request);
  const id = params.id;
  if (!id) throw json({ error: "No classroom name provided" }, 404);

  const classroom = await getClassroom(id);
  if (!classroom) throw json({ error: "Classroom not found" }, 404);

  return json({ classroom });
};

export default function ClassroomPage() {
  const { classroom } = useLiveLoader<typeof loader>();
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

    submit(formData, { method: "post" });
  };

  return (
    <Content title={classroom.name} sidebar={<Sidebar classroom={classroom} />}>
      <Feeds posts={classroom.posts} />
      <Form method="post" onSubmit={handleOnSubmit}>
        <TextAreaField textAreaRef={textAreaRef} />
      </Form>
    </Content>
  );
}
