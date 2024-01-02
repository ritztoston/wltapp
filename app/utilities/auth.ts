import { User } from "@prisma/client";
import { Session } from "@remix-run/node";

import { authenticator } from "~/auth0.server";
import { logout, sessionStorage } from "~/session.server";

import { urlParser, useMatchesData } from ".";

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
  return user as User;
};

export const authenticate = async (request: Request): Promise<User> => {
  const session = await getSession(request);
  const user = session.get("user") as User | null;

  if (!user) {
    const path = urlParser(new URL(request.url).pathname);
    return await authenticator.isAuthenticated(request, {
      failureRedirect: `/login?redirectTo=${path}`,
    });
  }

  return user;
};

const isUser = (user: User) => {
  return user && typeof user === "object" && typeof user.email === "string";
};

export const useOptionalUser = () => {
  const data = useMatchesData("root");
  if (!data || !isUser(data.user as User)) {
    return undefined;
  }
  return data.user;
};

export const useUser = () => {
  const maybeUser = useOptionalUser();
  if (!maybeUser) {
    throw new Error("No user found in root loader.");
  }

  return maybeUser as User;
};
