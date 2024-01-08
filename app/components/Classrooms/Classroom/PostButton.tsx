import { User } from "@prisma/client";
import { Dispatch, SetStateAction } from "react";

export const PostButton = ({
  state,
  user,
}: {
  state: [
    boolean,
    Dispatch<SetStateAction<boolean>>,
    Dispatch<
      SetStateAction<{
        id: string;
        content: string;
      }>
    >,
  ];
  user: User;
}) => {
  const [, setOpen, setSelectedPost] = state;

  const handleOpenNewPost = () => {
    setOpen(true);
    setSelectedPost({ id: "", content: "" });
  };

  return (
    <button
      className="flex space-x-4 bg-gray-800 rounded-lg p-4 shadow-lg border border-gray-700 items-center text-gray-500 ring-0 active:ring-0 focus:ring-0"
      onClick={handleOpenNewPost}
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
