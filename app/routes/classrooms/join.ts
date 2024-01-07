import { ActionFunctionArgs, json, redirect } from "@remix-run/node";

import { joinClassroom } from "~/models/classroom.server";
import { setNotification } from "~/notification.server";
import { DEFAULT_AUTH_HOME } from "~/utilities";
import { authenticate, commitSession } from "~/utilities/auth";
import { Snackbar } from "~/utilities/types";

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    const [user, formData] = await Promise.all([
      authenticate(request),
      request.formData(),
    ]);

    const code = formData.get("code") as string;

    const result = await joinClassroom(code, user.id);

    return redirect("/classrooms/".concat(result.id));
  } catch (error) {
    if (error instanceof Response) {
      const notification: Snackbar = {
        title: "Unable to join classroom",
        description: error.statusText,
        type: "error",
        close: true,
      };

      const session = await setNotification(request, notification);

      return redirect("/", {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      });

      return json(
        { notification },
        {
          headers: {
            "Set-Cookie": await commitSession(session),
          },
        },
      );
    }
    throw error;
  }
};

export const loader = () => redirect(DEFAULT_AUTH_HOME);
