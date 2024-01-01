import { authenticator } from "~/auth0.server";
import { User, getUser } from "~/models/user.server";
import { getSession, logout } from "~/session.server";

import { urlParser } from ".";

export const authenticate = async (request: Request): Promise<User> => {
  const session = await getSession(request);
  let auth = session.get("user") as User | null;

  if (!auth) {
    const path = urlParser(new URL(request.url).pathname);
    auth = (await authenticator.isAuthenticated(request, {
      failureRedirect: `/login?redirectTo=${path}`,
    })) as User;
  }

  const user = await getUser(auth.id);
  if (!user) {
    await logout(request);
    throw new Error("User not found");
  }

  return user;
};
