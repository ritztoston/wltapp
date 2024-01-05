import { ArrowDownCircleIcon } from "@heroicons/react/24/solid";
import parse from "html-react-parser";

import { ClassroomWithStudents } from "~/models/classroom.server";
import { getUserFullName } from "~/utilities";

import { TimeAgo } from "../../TimeAgo";

interface LocalProps {
  posts: ClassroomWithStudents["posts"];
  isLoading: boolean;
}

export const Feeds = ({ posts, isLoading }: LocalProps) => {
  return (
    <div className="flex flex-col-reverse">
      {posts.map((post) => (
        <div
          key={post.id}
          className="mb-4 first:mb-0 bg-gray-800 rounded-lg p-4 border border-gray-700"
        >
          <div className="relative">
            <div className="relative flex items-start space-x-3">
              <>
                <div className="relative">
                  <img
                    className="flex h-8 w-8 items-center justify-center rounded-full"
                    src={post.author.image}
                    alt=""
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div>
                    <div className="text-sm">
                      <div className="font-medium text-main-blue">
                        {getUserFullName(
                          post.author.firstName,
                          post.author.lastName,
                        )}
                      </div>
                    </div>
                    <p className="mt-0.5 text-xs text-gray-500">
                      <TimeAgo date={post.createdAt} />
                    </p>
                  </div>
                  <div className="prose mt-2 text-sm text-gray-300">
                    {parse(post.content)}
                  </div>
                </div>
              </>
            </div>
          </div>
        </div>
      ))}
      {isLoading ? (
        <ArrowDownCircleIcon className="animate-bounce h-10 w-10 text-main-blue" />
      ) : null}
    </div>
  );
};
