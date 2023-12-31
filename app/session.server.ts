import { createCookie } from "@remix-run/node";
import invariant from "tiny-invariant";

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

export async function getSession(request: Request) {
  const cookie = request.headers.get("Cookie");
  return sessionStorage.getSession(cookie);
}

export const sessionStorage = createDatabaseSessionStorage({
  cookie: sessionCookie,
});

// const USER_SESSION_KEY = "userId";

// export async function getUserId(
//   request: Request,
// ): Promise<User["id"] | undefined> {
//   const session = await getSession(request);
//   const userId = session.get(USER_SESSION_KEY);
//   return userId;
// }

// export async function getUser(request: Request) {
//   const userId = await getUserId(request);
//   if (userId === undefined) return null;

//   const user = await getUserById(userId);
//   if (user) return user;

//   throw await logout(request);
// }

// export async function requireUserId(
//   request: Request,
//   redirectTo: string = new URL(request.url).pathname,
// ) {
//   const userId = await getUserId(request);
//   if (!userId) {
//     const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
//     throw redirect(`/login?${searchParams}`);
//   }
//   return userId;
// }

// export async function requireUser(request: Request) {
//   const userId = await requireUserId(request);

//   const user = await getUserById(userId);
//   if (user) return user;

//   throw await logout(request);
// }

// export async function createUserSession({
//   request,
//   userId,
//   remember,
//   redirectTo,
// }: {
//   request: Request;
//   userId: string;
//   remember: boolean;
//   redirectTo: string;
// }) {
//   const session = await getSession(request);
//   session.set(USER_SESSION_KEY, userId);
//   return redirect(redirectTo, {
//     headers: {
//       "Set-Cookie": await sessionStorage.commitSession(session, {
//         maxAge: remember
//           ? 60 * 60 * 24 * 7 // 7 days
//           : undefined,
//       }),
//     },
//   });
// }

// export async function logout(request: Request) {
//   const session = await getSession(request);
//   return redirect("/", {
//     headers: {
//       "Set-Cookie": await sessionStorage.destroySession(session),
//     },
//   });
// }
