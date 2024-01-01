import { User } from "@prisma/client";

import { getUserFullName } from "~/utilities";

export const UserCard = ({ user }: { user: User }) => (
  <div className="flex items-center gap-x-4 py-3 text-xs font-semibold text-gray-300">
    <img
      className="h-8 w-8 rounded-full"
      src={user.image}
      alt={getUserFullName(user.firstName, user.lastName)}
    />
    <div className="flex flex-col gap-y-1">
      <div aria-hidden="true" className="flex">
        {getUserFullName(user.firstName, user.lastName)}
      </div>
      <div aria-hidden="true" className="flex">{user.email}</div>
    </div>
  </div>
);
