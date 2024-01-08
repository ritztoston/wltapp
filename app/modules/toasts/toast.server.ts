import { createCookieSessionStorage } from "@remix-run/node";
import invariant from "tiny-invariant";

invariant(process.env.SESSION_SECRET, "SESSION_SECRET must be set");

const { getSession, commitSession } = createCookieSessionStorage({
  cookie: {
    name: "__toast",
    secrets: [process.env.SESSION_SECRET],
    sameSite: "lax",
  },
});

export interface Toast {
  type: "success" | "error" | "info" | "warning";
  message: string;
  title?: string;
  key?: string;
}

export const setToast = async (toast: Toast, headers = new Headers()) => {
  const session = await getSession();
  session.flash("toast", toast);
  headers.set("Set-Cookie", await commitSession(session));
  return headers;
};

export const popToast = async (request: Request, headers = new Headers()) => {
  const session = await getSession(request.headers.get("Cookie"));
  const toast = (session.get("toast") ?? null) as Toast | null;
  headers.set("Set-Cookie", await commitSession(session));
  return { toast, headers };
};
