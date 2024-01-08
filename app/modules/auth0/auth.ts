import { User } from "@prisma/client";
import { Session } from "@remix-run/node";

import { UserWithClassrooms } from "~/models/user.server";
import { authenticator } from "~/modules/auth0/auth0.server";
import {
  logout,
  sessionStorage,
} from "~/modules/sessionStorage/session.server";

import { urlParser, useMatchesData } from "../../utilities";

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

export const authenticate = async (
  request: Request,
): Promise<UserWithClassrooms> => {
  const session = await getSession(request);
  const user = session.get("user") as UserWithClassrooms | null;

  if (!user) {
    const path = urlParser(new URL(request.url).pathname);
    return await authenticator.isAuthenticated(request, {
      failureRedirect: `/login?redirectTo=${path}`,
    });
  }

  return user;
};

const isUser = (user: UserWithClassrooms) => {
  return user && typeof user === "object" && typeof user.email === "string";
};

export const useOptionalUser = () => {
  const data = useMatchesData("root");
  if (!data || !isUser(data.user as UserWithClassrooms)) {
    return undefined;
  }
  return data.user;
};

export const useUser = () => {
  const maybeUser = useOptionalUser();
  if (!maybeUser) {
    throw new Error("No user found in root loader.");
  }

  return maybeUser as UserWithClassrooms;
};
