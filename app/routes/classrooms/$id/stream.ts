import { LoaderFunctionArgs, json } from "@remix-run/node";

import { createEventStream } from "~/stream.server";
import { getUserSession } from "~/utilities/auth";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const user = await getUserSession(request);

  if (!user) {
    throw json({ error: "You must be logged in to access this page" }, 401);
  }

  const id = params.id;
  if (!id) throw json({ error: "No classroom ID provided" }, 404);

  return createEventStream(request, id);
};
