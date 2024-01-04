import { User } from "@prisma/client";
import { Dispatch, SetStateAction } from "react";

export const PostButton = ({
  state,
  user,
}: {
  state: [boolean, Dispatch<SetStateAction<boolean>>];
  user: User;
}) => {
  const [, setOpen] = state;
  return (
    <button
      className="flex space-x-4 bg-gray-800 rounded-lg p-4 shadow-lg border border-gray-700 items-center text-gray-500 ring-0 active:ring-0 focus:ring-0"
      onClick={() => setOpen(true)}
    >
      <div className="flex-shrink-0">
        <img
          className="inline-block h-8 w-8 rounded-full"
          src={user.image}
          alt={user.lastName}
        />
      </div>
      <div className="min-w-0">Announce something to your class...</div>
    </button>
  );
};
