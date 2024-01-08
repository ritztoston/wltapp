import { ActionFunctionArgs, json, redirect } from "@remix-run/node";

import { joinClassroom } from "~/models/classroom.server";
import { authenticate } from "~/modules/auth0/auth";
import { Toast, setToast } from "~/modules/toasts/toast.server";
import { DEFAULT_AUTH_HOME } from "~/utilities";

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    const [user, formData] = await Promise.all([
      authenticate(request),
      request.formData(),
    ]);

    const code = formData.get("code") as string;

    const result = await joinClassroom(code, user.id);

    const toast: Toast = {
      message: `You have joined ${result.name}!`,
      type: "success",
      key: new Date().toISOString(),
    };

    const headers = await setToast(toast);

    return redirect("/classrooms/".concat(result.id), { headers });
  } catch (error) {
    if (error instanceof Response) {
      const toast: Toast = {
        message: error.statusText,
        type: "error",
        key: new Date().toISOString(),
      };

      const headers = await setToast(toast, error.headers);
      return json(null, { headers });
    }
    throw error;
  }
};

export const loader = () => redirect(DEFAULT_AUTH_HOME);
