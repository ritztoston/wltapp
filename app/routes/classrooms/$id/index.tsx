import { ClipboardDocumentListIcon } from "@heroicons/react/24/solid";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
  json,
} from "@remix-run/node";
import { Form, useSubmit } from "@remix-run/react";
import { useRef } from "react";

import { Feeds } from "~/components/Classrooms/Classroom/Feeds";
import { Sidebar } from "~/components/Classrooms/Classroom/Sidebar";
import { Content } from "~/components/Content";
import { TextAreaField } from "~/components/Fields/TextAreaField";
import { emitter } from "~/emitter.server";
import { getClassroom } from "~/models/classroom.server";
import { createPost } from "~/models/post.server";
import { capitalize } from "~/utilities";
import { authenticate } from "~/utilities/auth";
import { useLiveLoader } from "~/utilities/useLiveLoader";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const classroom = data?.classroom;

  return [
    {
      title: `${
        classroom ? capitalize(classroom.name).concat(" | ") : ""
      }`.concat("ClassMaster"),
    },
  ];
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const id = params.id;
  if (!id) throw json({ error: "No classroom name provided" }, 404);

  const user = await authenticate(request);
  const formData = await request.formData();
  const comment = formData.get("comment") as string;

  const result = await createPost(comment, id, user.id);

  if (!result) {
    return json({ success: false, error: result });
  }

  emitter.emit(id);
  return json({ success: true, result, error: {} });
};

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const id = params.id;
  if (!id) throw json({ error: "No classroom ID provided" }, 404);

  const [classroom] = await Promise.all([
    getClassroom(id),
    authenticate(request),
  ]);

  if (!classroom) throw json({ error: "Classroom not found" }, 404);

  return json({ classroom });
};

export default function ClassroomPage() {
  const { classroom } = useLiveLoader<typeof loader>();
  const submit = useSubmit();

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleOnSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const comment = formData.get("comment") as string;

    // do nothing if the comment is empty
    if (!comment) return;

    // clear the content input field
    if (textAreaRef.current) {
      textAreaRef.current.value = "";
    }

    submit(formData, { method: "post" });
  };

  return (
    <Content title={classroom.name} sidebar={<Sidebar classroom={classroom} />}>
      <div className="grid grid-cols-9 gap-4">
        <div className="col-span-3 rounded-lg">
          <div className="rounded-lg grid grid-cols-1 gap-4 border border-gray-700 p-4 text-gray-300">
            <div>Class code</div>
            <div>
              <div className="mt-2 flex rounded-md shadow-sm">
                <div className="relative focus-within:z-10">
                  <input
                    disabled
                    type="text"
                    className="truncate bg-gray-800 block w-full rounded-none rounded-l-md border-0 py-1.5 text-gray-300 ring-1 ring-inset ring-gray-700 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                    defaultValue={classroom.id}
                  />
                </div>
                <button
                  type="button"
                  className="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-700 hover:bg-gray-700"
                >
                  <ClipboardDocumentListIcon
                    className="-ml-0.5 h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-y-4 col-span-6">
          <Form method="post" onSubmit={handleOnSubmit}>
            <TextAreaField textAreaRef={textAreaRef} />
          </Form>
          <Feeds posts={classroom.posts} />
        </div>
      </div>
    </Content>
  );
}
