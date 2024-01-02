import { LoaderFunctionArgs, json } from "@remix-run/node";

import { createEventStream } from "~/stream.server";
import { getUserSession } from "~/utilities/auth";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const user = await getUserSession(request);

  if (user) {
    throw json({ error: "You must be logged in to access this page" }, 401);
  }

  const classroomName = params.id;
  if (!classroomName) throw json({ error: "No classroom name provided" }, 404);

  return createEventStream(request, classroomName);
};
