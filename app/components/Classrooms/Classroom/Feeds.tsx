import { Menu, Transition } from "@headlessui/react";
import {
  ArrowDownCircleIcon,
  PencilSquareIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/solid";
import parse from "html-react-parser";
import { Dispatch, Fragment, SetStateAction } from "react";

import { ClassroomWithStudents } from "~/models/classroom.server";
import { classNames, getUserFullName } from "~/utilities";

import { TimeAgo } from "../../TimeAgo";

interface LocalProps {
  posts: ClassroomWithStudents["posts"];
  isLoading: boolean;
  state: [
    Dispatch<SetStateAction<boolean>>,
    Dispatch<
      SetStateAction<{
        id: string;
        content: string;
      }>
    >,
  ];
}

export const Feeds = ({ posts, isLoading, state }: LocalProps) => {
  const [setOpen, setPosts] = state;
  return (
    <div className="flex flex-col">
      {posts.map((post) => (
        <div
          key={post.id}
          className="mb-4 last:mb-0 bg-gray-800 rounded-lg p-4 border border-gray-700 transition ease-in duration-300"
        >
          <div className="flex space-x-3">
            <div className="flex-shrink-0">
              <img
                className="h-10 w-10 rounded-full"
                src={post.author.image}
                alt=""
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-main-blue">
                {getUserFullName(post.author.firstName, post.author.lastName)}
              </p>
              <p className="text-sm text-gray-500">
                <TimeAgo date={post.createdAt} />{" "}
                {post.updatedAt ? " · ".concat("Edited") : ""}
              </p>
            </div>
            <div className="flex flex-shrink-0 self-center">
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <Menu.Button className="-m-2 flex items-center rounded-full p-2 text-gray-400 hover:text-gray-600">
                    <EllipsisVerticalIcon
                      className="h-5 w-5"
                      aria-hidden="true"
                    />
                  </Menu.Button>
                </div>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md shadow-lg focus:outline-none border border-gray-700">
                    <div className="py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={classNames(
                              active ? "text-white" : "text-gray-400",
                              "group flex px-4 py-2 text-sm w-full",
                            )}
                            onClick={() => {
                              setOpen(true);
                              setPosts(post);
                            }}
                          >
                            <PencilSquareIcon
                              className="mr-3 h-5 w-5 text-gray-400 group-hover:text-white"
                              aria-hidden="true"
                            />
                            <span>Edit Post</span>
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>
          <div className="prose mt-4 text-sm text-gray-300">
            {parse(post.content)}
          </div>
        </div>
      ))}
      {isLoading ? (
        <ArrowDownCircleIcon className="animate-bounce h-10 w-10 text-main-blue self-center mt-8" />
      ) : null}
    </div>
  );
};
