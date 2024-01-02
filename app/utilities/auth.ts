import { User } from "@prisma/client";
import { Session } from "@remix-run/node";

import { authenticator } from "~/auth0.server";
import { getUser } from "~/models/user.server";
import { logout, sessionStorage } from "~/session.server";

import { urlParser } from ".";

export const getSession = async (request: Request) => {
  const cookie = request.headers.get("Cookie");
  return sessionStorage.getSession(cookie);
};

export const commitSession = async (session: Session) => {
  return sessionStorage.commitSession(session);
};

export const destroySession = async (session: Session) => {
  return sessionStorage.destroySession(session);
};

export const getUserSession = async (request: Request) => {
  const session = await getSession(request);
  const user = session.get("user");
  if (!user) {
    await logout(request);
    return null;
  }
  return user;
};

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
