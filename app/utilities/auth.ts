import { User } from "@prisma/client";

import { authenticator } from "~/auth0.server";
import { getSession } from "~/session.server";

import { urlParser } from ".";

export const authenticate = async (request: Request) => {
  const session = await getSession(request);
  const user = session.get("user") as User | null;

  if (!user) {
    const path = urlParser(new URL(request.url).pathname);
    return (await authenticator.isAuthenticated(request, {
      failureRedirect: `/login?redirectTo=${path}`,
    })) as User;
  }

  return user;
};
