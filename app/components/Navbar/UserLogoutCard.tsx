import { Form } from "@remix-run/react";

import { UserWithClassrooms } from "~/models/user.server";
import { getUserFullName } from "~/utilities";

export const UserLogoutCard = ({ user }: { user: UserWithClassrooms }) => {
  return (
    <div className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-300">
      <img
        className="h-11 w-11 rounded-full"
        src={user.image}
        alt={getUserFullName(user.firstName, user.lastName)}
      />
      <div>
        <div aria-hidden="true">
          {getUserFullName(user.firstName, user.lastName)}
        </div>
        <div aria-hidden="true">
          <Form action="/logout" method="post">
            <button className="items-center flex w-full flex-none gap-x-2 text-red-400 hover:text-red-500 font-medium">
              <dt className="flex-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
                  />
                </svg>
              </dt>
              <dd className="text-sm">Sign out</dd>
            </button>
          </Form>
        </div>
      </div>
    </div>
  );
};
