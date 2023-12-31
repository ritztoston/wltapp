import { createCookie } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/server-runtime";

import { authenticator } from "~/auth0.server";

export const loader: LoaderFunction = async ({ request }) => {
  const returnToCookie = createCookie("returnToCookie", { maxAge: 3600 });
  const result = await returnToCookie.parse(request.headers.get("Cookie"));
  const returnTo = result ?? "/";

  return await authenticator.authenticate("auth0", request, {
    successRedirect: returnTo,
    failureRedirect: "/login",
    throwOnError: true,
  });
};
