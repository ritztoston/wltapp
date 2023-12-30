import { ActionFunction, redirect } from "@remix-run/node";

import { getSession } from "~/session.server";

export const action: ActionFunction = async ({ request }) => {
  const session = await getSession(request);

  const tenant = process.env.AUTH0_TENANT as string;
  const appSite = process.env.APP_SITE as string;
  const authClient = process.env.AUTH0_CLIENT_ID as string;

  const logoutURL = new URL(`https://${tenant}/v2/logout`);

  logoutURL.searchParams.set("client_id", authClient);
  logoutURL.searchParams.set(
    "returnTo",
    process.env.NODE_ENV === "development" ? appSite : "",
  );

  return redirect(logoutURL.toString(), {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
};
