import { Session, createCookie, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";

import { authenticator } from "~/auth0.server";

import { createDatabaseSessionStorage } from "./utilities/dbsessions";

invariant(process.env.SESSION_SECRET, "SESSION_SECRET must be set");

const sessionCookie = createCookie("__session", {
  secrets: [process.env.SESSION_SECRET],
  maxAge: 36000,
  sameSite: "lax", // this helps with CSRF
  path: "/", // remember to add this so the cookie will work in all routes
  httpOnly: true, // for security reasons, make this cookie http only
  secure: process.env.NODE_ENV === "production",
});

export const sessionStorage = createDatabaseSessionStorage({
  cookie: sessionCookie,
});

export const getSession = (request: Request) => {
  const cookie = request.headers.get("Cookie");
  return sessionStorage.getSession(cookie);
};

export const commitSession = async (session: Session) => { 
  return sessionStorage.commitSession(session);
};

export const getUser = async (request: Request) => {
  const cookie = request.headers.get("Cookie");
  const session = await sessionStorage.getSession(cookie);
  const user = session.get("user");
  if (!user) {
    await logout(request);
    return null;
  }
  return user;
};

export const login = async (request: Request) => {
  const url = new URL(request.url);
  const returnTo = url.searchParams.get("redirectTo") as string | null;

  try {
    return await authenticator.authenticate("auth0", request, {
      successRedirect: returnTo ?? "/",
      failureRedirect: "/login",
    });
  } catch (error) {
    if (error instanceof Response) {
      const returnToCookie = createCookie("returnToCookie", {
        maxAge: 3600,
      });
      error.headers.append(
        "Set-Cookie",
        await returnToCookie.serialize(returnTo),
      );
    }
    throw error;
  }
};

export const logout = async (request: Request) => {
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

  const result = createCookie("returnToCookie");
  try {
    const headers = new Headers();

    headers.append("Set-Cookie", await sessionStorage.destroySession(session));
    headers.append(
      "Set-Cookie",
      await result.serialize("returnToCookie", {
        expires: new Date("2000"),
      }),
    );

    return redirect(logoutURL.toString(), {
      headers: headers,
    });
  } catch (e) {
    return redirect("/");
  }
};
