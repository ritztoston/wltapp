import { Session } from "@remix-run/node";
import { getSession } from "./session.server";
import { Snackbar } from "./utilities/types";

export const setNotification = async (
  request: Request,
  notification: Snackbar,
): Promise<Session> => {
  const session = await getSession(request);
  session.flash("__notification", JSON.stringify(notification));

  return session;
};

export const getNotification = async (request: Request) => {
  const session = await getSession(request);
  const notification = session.get("__notification");
  if (!notification) return { session, notification: null };

  return { session, notification: JSON.parse(notification) as Snackbar };
};
