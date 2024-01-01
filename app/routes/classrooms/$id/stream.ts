import { LoaderFunctionArgs, json } from "@remix-run/node";

import { createEventStream } from "~/createEventStream.server";
import { authenticate } from "~/utilities/auth";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  await authenticate(request);

  const classroomName = params.id;
  if (!classroomName) throw json({ error: "No classroom name provided" }, 404);

  return createEventStream(request, classroomName);
};
