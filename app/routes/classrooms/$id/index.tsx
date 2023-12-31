import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
  json,
} from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";

import { Content } from "~/components/Content";
import { getClassroomByName, joinClassroom } from "~/models/classroom.server";
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
  const moderatorId = formData.get("moderatorId") as string;

  const result = await joinClassroom(id, user.id, moderatorId);

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

  return (
    <Content title={classroom.name} user={user}>
      {classroom.name}
      <Form method="post">
        <input type="hidden" name="id" value={classroom.id} />
        <input type="hidden" name="moderatorId" value={classroom.userId} />
        <button>Join</button>
      </Form>
    </Content>
  );
}
