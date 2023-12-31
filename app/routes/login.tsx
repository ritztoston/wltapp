import type { ActionFunction, LoaderFunction } from "@remix-run/server-runtime";

import { login } from "~/session.server";

export const action: ActionFunction = ({ request }) => login(request);
export const loader: LoaderFunction = ({ request }) => login(request);
