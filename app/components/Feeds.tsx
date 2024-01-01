import { ChatBubbleLeftEllipsisIcon } from "@heroicons/react/20/solid";
import { getUserFullName } from "~/utilities";
import { ClassroomWithStudents } from "~/models/classroom.server";
import { TimeAgo } from "./TimeAgo";
import { useEffect, useRef } from "react";

export const Feeds = ({ posts }: { posts: ClassroomWithStudents["posts"] }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [posts]);

  return (
    <div className="flow-root mb-8">
      <ul role="list">
        {posts.map((post) => (
          <li
            key={post.id}
            className="mb-4 last:mb-0 bg-gray-900 rounded-lg shadow-lg p-4"
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

                    <span className="absolute -bottom-0.5 -right-1 rounded-tl bg-gray-900 px-0.5 py-px">
                      <ChatBubbleLeftEllipsisIcon
                        className="h-4 w-4 text-gray-400"
                        aria-hidden="true"
                      />
                    </span>
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
                    <div className="mt-2 text-sm text-gray-300">
                      <p>{post.content}</p>
                    </div>
                  </div>
                </>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div ref={messagesEndRef} />
    </div>
  );
};
