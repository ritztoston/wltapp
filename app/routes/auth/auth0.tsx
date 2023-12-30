// app/routes/auth/auth0.tsx
import {
  redirect,
  type ActionFunction,
  type LoaderFunction,
} from "@remix-run/node";

import { authenticator } from "~/auth0.server";

export const loader: LoaderFunction = () => redirect("/login");

export const action: ActionFunction = ({ request }) => {
  return authenticator.authenticate("auth0", request);
};
