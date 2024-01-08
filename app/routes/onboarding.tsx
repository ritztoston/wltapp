import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Form, useNavigation, useSubmit } from "@remix-run/react";
import { FormEvent, useState } from "react";
import * as z from "zod";

import { InputField } from "~/components/Fields/InputField";
import { User, updateUser } from "~/models/user.server";
import {
  authenticate,
  commitSession,
  getSession,
  useUser,
} from "~/modules/auth0/auth";
import { DEFAULT_AUTH_HOME, validationAction } from "~/utilities";

interface Fields {
  firstName: string;
  lastName: string;
}

const schema = z.object({
  firstName: z.string().min(1, "First name is required."),
  lastName: z.string().min(1, "Last name is required."),
});

export const action = async ({ request }: LoaderFunctionArgs) => {
  const user = await authenticate(request);
  const session = await getSession(request);

  const formData = await request.formData();
  const firstName = String(formData.get("firstName"));
  const lastName = String(formData.get("lastName"));

  await updateUser(user.id, firstName, lastName);

  const updatedUser: User = {
    ...user,
    onBoarding: true,
    firstName,
    lastName,
  };

  session.set("user", updatedUser);

  return redirect(DEFAULT_AUTH_HOME, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await authenticate(request);

  if (!user.onBoarding) return null;

  return redirect(DEFAULT_AUTH_HOME);
};

export default function OnBoarding() {
  const user = useUser();
  const submit = useSubmit();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>();

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Clear errors on submit
    setErrors({});

    const formData = new FormData(event.currentTarget);
    const firstName = String(formData.get("firstName"));
    const lastName = String(formData.get("lastName"));

    const action = validationAction<Fields>({
      body: {
        firstName,
        lastName,
      },
      schema: schema,
    });

    if (action.errors) {
      return setErrors(action.errors);
    }

    submit(formData, {
      method: "post",
    });
  };

  return (
    <div className="py-24">
      <div className="relative isolate">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="relative mx-auto flex max-w-2xl flex-col gap-16 bg-white/5 ring-1 ring-white/10 sm:rounded-3xl lg:mx-0 lg:max-w-none lg:flex-row lg:items-center xl:gap-x-20 overflow-hidden">
            <div className="relative h-80 md:absolute md:left-0 md:h-full md:w-1/3 lg:w-1/2">
              <img
                className="h-full w-full object-cover"
                src="https://images.unsplash.com/photo-1525130413817-d45c1d127c42?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1920&q=60&blend=6366F1&sat=-100&blend-mode=multiply"
                alt=""
              />
              <svg
                viewBox="0 0 926 676"
                aria-hidden="true"
                className="absolute -bottom-24 left-24 w-[57.875rem] transform-gpu blur-[118px]"
              >
                <path
                  fill="url(#60c3c621-93e0-4a09-a0e6-4c228a0116d8)"
                  fillOpacity=".4"
                  d="m254.325 516.708-90.89 158.331L0 436.427l254.325 80.281 163.691-285.15c1.048 131.759 36.144 345.144 168.149 144.613C751.171 125.508 707.17-93.823 826.603 41.15c95.546 107.978 104.766 294.048 97.432 373.585L685.481 297.694l16.974 360.474-448.13-141.46Z"
                />
                <defs>
                  <linearGradient
                    id="60c3c621-93e0-4a09-a0e6-4c228a0116d8"
                    x1="926.392"
                    x2="-109.635"
                    y1=".176"
                    y2="321.024"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#776FFF" />
                    <stop offset={1} stopColor="#FF4694" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="relative mx-auto max-w-7xl py-24 sm:py-32 lg:px-8 lg:py-40">
              <div className="pl-6 pr-6 md:ml-auto md:w-2/3 md:pl-16 lg:w-1/2 lg:pl-24 lg:pr-0 xl:pl-32">
                <h2 className="text-base font-semibold leading-7 text-main-blue">
                  Step Into Success: Introduce Yourself!
                </h2>
                <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-3xl">
                  Your unique journey begins with a simple introduction.
                </p>
                <p className="mt-6 text-base leading-7 text-gray-300">
                  To ensure your experience is tailored just for you, we&apos;d
                  love to know your name. Share it with us, and let&apos;s kick
                  off this exciting chapter of your journey!
                </p>
                <Form onSubmit={handleFormSubmit}>
                  <div className="mt-8 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                    <InputField
                      name="firstName"
                      label="First Name"
                      placeholder="Jane"
                      defaultValue={user.firstName}
                      error={errors?.firstName}
                      disabled={isSubmitting}
                    />
                    <InputField
                      name="lastName"
                      label="Last Name"
                      placeholder="Doe"
                      defaultValue={user.lastName}
                      error={errors?.lastName}
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="mt-8">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center rounded-md bg-main-blue px-4 py-4 font-bold text-gray-300 shadow-sm hover:bg-main-blue/90 w-full justify-center disabled:bg-gray-500 disabled:text-gray-300"
                    >
                      Continue <ChevronRightIcon className="h-5 w-5" />
                    </button>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>
        <div
          className="absolute inset-x-0 -top-16 -z-10 flex transform-gpu justify-center overflow-hidden blur-3xl"
          aria-hidden="true"
        >
          <div
            className="aspect-[1318/752] w-[82.375rem] flex-none bg-gradient-to-r from-[#80caff] to-[#4f46e5] opacity-25"
            style={{
              clipPath:
                "polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
