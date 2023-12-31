import { authenticator } from "~/auth0.server";
import { getSession } from "~/session.server";

import { urlParser } from ".";
import { UserWithClassrooms, getUser } from "~/models/user.server";

export const authenticate = async (
  request: Request,
): Promise<UserWithClassrooms> => {
  const session = await getSession(request);
  let user = session.get("user") as UserWithClassrooms | null;

  if (!user) {
    const path = urlParser(new URL(request.url).pathname);
    user = (await authenticator.isAuthenticated(request, {
      failureRedirect: `/login?redirectTo=${path}`,
    })) as UserWithClassrooms;
  }

  return (await getUser(user.id)) as UserWithClassrooms;
};
