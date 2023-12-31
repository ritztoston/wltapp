import { ActionFunction, LoaderFunction } from "@remix-run/node";

import { logout } from "~/session.server";

export const action: ActionFunction = async ({ request }) => logout(request);
export const loader: LoaderFunction = async ({ request }) => logout(request);
