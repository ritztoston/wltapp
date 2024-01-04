import { User } from "~/models/user.server";
import { getUserFullName } from "~/utilities";

export const UserCard = ({ user }: { user: User }) => (
  <div className="flex items-center gap-x-4 py-3 text-sm font-semibold text-gray-300">
    <img
      className="h-10 w-10 rounded-full"
      src={user.image}
      alt={getUserFullName(user.firstName, user.lastName)}
    />
    <div className="flex flex-col gap-y-1">
      <div aria-hidden="true" className="flex">
        {getUserFullName(user.firstName, user.lastName)}
      </div>
      <div aria-hidden="true" className="flex">
        {user.email}
      </div>
    </div>
  </div>
);
