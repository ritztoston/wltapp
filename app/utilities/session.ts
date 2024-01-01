import { Session } from "@remix-run/node";
import { commitSession as cs } from "~/session.server";

export const commitSession = async (session: Session) => {
  return await cs(session);
};
