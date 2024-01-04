import { Dialog } from "@headlessui/react";
import { SquaresPlusIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
  defer,
  redirect,
} from "@remix-run/node";
import {
  Await,
  Form,
  Link,
  useLoaderData,
  useNavigation,
  useSubmit,
} from "@remix-run/react";
import { useState, FormEvent, Suspense, useRef } from "react";
import * as z from "zod";

import { ClassroomsSkeleton } from "~/components/Classrooms/ClassroomsSkeleton";
import { Content } from "~/components/Content";
import { InputField } from "~/components/Fields/InputField";
import { InputModal } from "~/components/Modals/InputModal";
import { createClassroom, getClassrooms } from "~/models/classroom.server";
import { acronymizer, capitalize, validationAction } from "~/utilities";
import { authenticate, commitSession, getSession } from "~/utilities/auth";

interface Fields {
  name: string;
}

const schema = z.object({
  name: z.string().min(1, "Classroom name is required."),
});

export const meta: MetaFunction = () => {
  return [{ title: "Home | ClassMaster" }];
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const [user, session, formData] = await Promise.all([
    authenticate(request),
    getSession(request),
    request.formData(),
  ]);

  const name = formData.get("name") as string;

  const result = await createClassroom({
    name,
    userId: user.id,
  });

  session.set("user", {
    ...user,
    moderated: [result, ...user.moderated.filter((_, index) => !(index >= 4))],
  });

  return redirect("/classrooms/".concat(result.id), {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await authenticate(request);
  const classrooms = getClassrooms(user.id);
  return defer({ classrooms });
};

export default function ClassroomsPage() {
  const { classrooms } = useLoaderData<typeof loader>();

  const ref = useRef<HTMLDivElement>(null);
  const submit = useSubmit();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>();

  const handleAddClassroom = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Clear errors on submit
    setErrors({});

    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;

    const action = validationAction<Fields>({
      body: {
        name,
      },
      schema: schema,
    });

    if (action.errors) {
      return setErrors(action.errors);
    }

    setOpen(false);

    submit(formData, {
      method: "post",
    });
  };

  const handleCancel = () => {
    setErrors({});
    setOpen(false);
  };

  return (
    <Content title="Classrooms">
      <div className="grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 sm:gap-y-10 lg:grid-cols-4 text-gray-800">
        <Suspense fallback={<ClassroomsSkeleton />}>
          <Await resolve={classrooms}>
            {(classrooms) => (
              <>
                {classrooms.length ? (
                  <>
                    <button
                      type="button"
                      className="relative group hover:cursor-pointer"
                      onClick={() => setOpen(true)}
                      disabled={isSubmitting}
                    >
                      <div className="aspect-h-3 aspect-w-4 overflow-hidden rounded-lg border-2 border-dashed border-main-blue hover:border-main-blue/50 focus:outline-none focus:ring-0 select-none">
                        <div className="mx-auto flex items-center justify-center">
                          <span className="text-6xl font-medium leading-none">
                            <SquaresPlusIcon className="h-24 w-24 text-main-blue" />
                          </span>
                        </div>
                        <div
                          className="flex items-end p-4 opacity-0 group-hover:opacity-100"
                          aria-hidden="true"
                        >
                          <div className="w-full rounded-md bg-opacity-75 px-4 py-2 text-center text-sm font-medium backdrop-blur backdrop-filter text-gray-300">
                            Create New Classroom
                          </div>
                        </div>
                      </div>
                      <p className="mt-4">;</p>
                    </button>
                    {classrooms.map((classroom, index) => (
                      <Link
                        key={classroom.id}
                        to={classroom.id}
                        className="hover:cursor-pointer"
                      >
                        <div
                          ref={
                            index === classrooms.length - 1 ? ref : undefined
                          }
                          className="aspect-h-3 aspect-w-4 overflow-hidden rounded-lg bg-gray-100 hover:shadow-xl hover:shadow-main-blue/50 border-2 border-main-blue"
                        >
                          <div className="bg-main-blue mx-auto flex items-center justify-center">
                            <span className="text-6xl font-medium leading-none text-white">
                              {acronymizer(capitalize(classroom.name))}
                            </span>
                          </div>
                        </div>
                        <p className="mt-4 text-gray-300">
                          {capitalize(classroom.name)}
                        </p>
                      </Link>
                    ))}
                  </>
                ) : (
                  <button
                    type="button"
                    className="relative group hover:cursor-pointer sm:col-span-4"
                    onClick={() => setOpen(true)}
                    disabled={isSubmitting}
                  >
                    <div className="aspect-h-1 aspect-w-6 overflow-hidden rounded-lg border-2 border-dashed border-main-blue hover:border-main-blue/50 focus:outline-none focus:ring-0 select-none">
                      <div className="mx-auto flex items-center justify-center">
                        <span className="text-6xl font-medium leading-none">
                          <SquaresPlusIcon className="h-24 w-24 text-main-blue" />
                        </span>
                      </div>
                      <div
                        className="flex items-end p-4 opacity-0 group-hover:opacity-100"
                        aria-hidden="true"
                      >
                        <div className="w-full rounded-md bg-opacity-75 px-4 py-2 text-center text-sm font-medium backdrop-blur backdrop-filter text-gray-300">
                          Create New Classroom
                        </div>
                      </div>
                    </div>
                    <p className="mt-4">;</p>
                  </button>
                )}
              </>
            )}
          </Await>
        </Suspense>
      </div>
      <InputModal open={open} setOpen={handleCancel}>
        <Form method="post" onSubmit={handleAddClassroom}>
          <div className="sm:flex sm:items-start">
            <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gray-800 sm:mx-0 sm:h-10 sm:w-10">
              <UserGroupIcon className="h-8 w-18 text-gray-300" />
            </div>
            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
              <Dialog.Title
                as="h3"
                className="text-xl font-bold leading-6 text-main-blue"
              >
                Add Classroom
              </Dialog.Title>
              <div className="mt-2 text-gray-300 text-sm">
                Step into our tech-equipped classroom for quick and accurate
                attendance.
              </div>
            </div>
          </div>
          <div className="mt-6 flex">
            <InputField
              className="grow"
              name="name"
              placeholder="New classroom name"
              error={errors?.name}
              disabled={isSubmitting}
            />
          </div>
          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button
              disabled={isSubmitting}
              className="disabled:bg-gray-500 disabled:text-gray-300 inline-flex w-full justify-center rounded-md bg-main-blue px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-main-blue/90 sm:ml-3 sm:w-auto"
            >
              {isSubmitting ? (
                <svg
                  aria-hidden="true"
                  role="status"
                  className="inline w-6 h-6 text-gray-300 animate-spin fill-main-blue"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
              ) : (
                "Submit"
              )}
            </button>
            {!isSubmitting ? (
              <button
                type="button"
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-0 hover:bg-gray-500 hover:text-white sm:mt-0 sm:w-auto"
                onClick={handleCancel}
              >
                Cancel
              </button>
            ) : null}
          </div>
        </Form>
      </InputModal>
    </Content>
  );
}
