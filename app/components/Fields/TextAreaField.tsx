import { User } from "@prisma/client";
import { LegacyRef, useRef } from "react";

export const TextAreaField = ({
  textAreaRef,
  user,
}: {
  textAreaRef: LegacyRef<HTMLTextAreaElement>;
  user: User;
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  return (
    <div className="flex items-start space-x-4 bg-gray-900 rounded-lg p-4 shadow-lg">
      <div className="flex-shrink-0">
        <img
          className="inline-block h-10 w-10 rounded-full"
          src={user.image}
          alt="commenter image"
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="relative">
          <div className="overflow-hidden rounded-lg ring-0 ring-inset ring-gray-300 focus-within:ring-0">
            <textarea
              rows={3}
              name="comment"
              id="comment"
              className="block w-full resize-none border-0 bg-transparent py-1.5 text-gray-300 placeholder:text-gray-500 focus:ring-0 sm:text-sm sm:leading-6"
              placeholder="Add your comment..."
              defaultValue={""}
              ref={textAreaRef}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  buttonRef.current?.click();
                }
              }}
            />

            {/* Spacer element to match the height of the toolbar */}
            <div className="py-2" aria-hidden="true">
              {/* Matches height of button in toolbar (1px border + 36px content height) */}
              <div className="py-px">
                <div className="h-9" />
              </div>
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 flex justify-between pl-3 pr-2">
            <div className="flex" />
            <div className="flex-shrink-0">
              <button
                type="submit"
                ref={buttonRef}
                className="inline-flex items-center rounded-md bg-main-blue px-3 py-2 text-sm font-semibold text-gray-300 shadow-sm hover:bg-main-blue/90"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
