import { Form, useSubmit } from "@remix-run/react";
import { Dispatch, SetStateAction } from "react";

import { useUser } from "~/modules/auth0/auth";

import { RichTextAreaField } from "./Fields/RichTextAreaField/RichTextAreaField";

export const PostCard = ({
  state,
  post,
}: {
  state: [boolean, Dispatch<SetStateAction<boolean>>];
  post?: {
    id: string;
    content: string;
  };
}) => {
  const [, setOpen] = state;
  const user = useUser();

  const submit = useSubmit();

  const handleOnSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const comment = formData.get("comment") as string;

    // do nothing if the comment is empty
    // or if the comment and post content are the same
    if (!comment) return;
    if (comment === post?.content) return;

    // close the dialog
    setOpen(false);

    if (post?.id) formData.append("id", post.id);
    submit(formData, { method: "post" });
  };

  return (
    <Form
      className="flex items-start space-x-4 bg-gray-800 rounded-lg p-4 shadow-lg border border-gray-700"
      onSubmit={handleOnSubmit}
    >
      <div className="flex-shrink-0">
        <img
          className="inline-block h-8 w-8 rounded-full"
          src={user.image}
          alt={user.lastName}
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="relative">
          <div className="overflow-hidden ring-0 ring-inset ring-gray-300 focus-within:ring-0">
            <RichTextAreaField post={post} />

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
                className="inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold text-gray-300 shadow-sm hover:text-main-blue/90"
              >
                {post?.id ? "Update" : "Post"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Form>
  );
};
