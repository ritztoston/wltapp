import { ActionFunctionArgs, redirect } from "@remix-run/node";

import { joinClassroom } from "~/models/classroom.server";
import { Toast, setToast } from "~/toast.server";
import { DEFAULT_AUTH_HOME } from "~/utilities";
import { authenticate } from "~/utilities/auth";

export const action = async ({ request }: ActionFunctionArgs) => {
  const searchParams = new URL(request.url).searchParams;
  const path = searchParams.get("path");

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
      return redirect(path || DEFAULT_AUTH_HOME, { headers });
    }
    throw error;
  }
};

export const loader = () => redirect(DEFAULT_AUTH_HOME);
