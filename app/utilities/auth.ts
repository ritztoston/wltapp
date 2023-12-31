import { authenticator } from "~/auth0.server";
import { User, getUser } from "~/models/user.server";
import { getSession } from "~/session.server";

import { urlParser } from ".";

export const authenticate = async (request: Request) => {
  const session = await getSession(request);
  let user = session.get("user") as User | null;

  if (!user) {
    const path = urlParser(new URL(request.url).pathname);
    user = (await authenticator.isAuthenticated(request, {
      failureRedirect: `/login?redirectTo=${path}`,
    })) as User;
  }

  return await getUser(user.id);
};
