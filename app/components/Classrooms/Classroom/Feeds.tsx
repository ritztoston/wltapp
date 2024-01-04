import { ClassroomWithStudents } from "~/models/classroom.server";
import { getUserFullName } from "~/utilities";

import { TimeAgo } from "../../TimeAgo";

export const Feeds = ({ posts }: { posts: ClassroomWithStudents["posts"] }) => {
  return (
    <div className="flex flex-col-reverse">
      {posts.map((post) => (
        <div
          key={post.id}
          className="mb-4 first:mb-0 bg-gray-800 rounded-lg p-4 border border-gray-700"
        >
          <div className="relative">
            {/* {index !== posts.length - 1 ? (
                <span
                  className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-gray-200"
                  aria-hidden="true"
                />
              ) : null} */}
            <div className="relative flex items-start space-x-3">
              <>
                <div className="relative">
                  <img
                    className="flex h-8 w-8 items-center justify-center rounded-full"
                    src={post.author.image}
                    alt=""
                  />

                  {/* <span className="absolute -bottom-0.5 -right-1 rounded-tl bg-gray-900 px-0.5 py-px">
                      <ChatBubbleLeftEllipsisIcon
                        className="h-4 w-4 text-gray-400"
                        aria-hidden="true"
                      />
                    </span> */}
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
                      Posted <TimeAgo date={post.createdAt} />
                    </p>
                  </div>
                  <div className="mt-2 text-sm text-gray-300">
                    <p>{post.content}</p>
                  </div>
                </div>
              </>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
