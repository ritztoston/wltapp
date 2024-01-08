import { Placeholder } from "@tiptap/extension-placeholder";
import { useEditor, EditorContent } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { useState } from "react";

import { Toolbar } from "./Toolbar";

export const RichTextAreaField = ({
  post,
}: {
  post?: {
    id: string;
    content: string;
  };
}) => {
  const [content, setContent] = useState(post?.content || "");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: "list-disc",
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal",
          },
        },
      }),
      Placeholder.configure({
        placeholder: "Announce something to your class...",
        emptyEditorClass:
          "cursor-text before:content-[attr(data-placeholder)] before:absolute before:top-3 before:left-2 before:opacity-50 before-pointer-events-none",
      }),
    ],
    content: content,
    editorProps: {
      attributes: {
        class:
          "prose block w-full resize-none bg-transparent px-2 py-3 text-gray-300 focus:ring-0 sm:text-sm sm:leading-6 focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  return (
    <div>
      <input
        type="hidden"
        name="comment"
        id="comment"
        className="block w-full resize-none border-0 bg-transparent py-1.5 text-gray-300 placeholder:text-gray-500 focus:ring-0 sm:text-sm sm:leading-6"
        value={content}
      />
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};
