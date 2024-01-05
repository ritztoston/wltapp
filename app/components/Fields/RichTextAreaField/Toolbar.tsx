import { Editor } from "@tiptap/react";
import {
  Bold,
  Strikethrough,
  Italic,
  List,
  ListOrdered,
  Heading2,
  CornerDownLeft,
} from "lucide-react";

import { classNames } from "~/utilities";

export const Toolbar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) return null;

  return (
    <div className="flex gap-0.5">
      <button
        data-tooltip-target="tooltip-top"
        data-tooltip-placement="top"
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={classNames(
          editor.isActive("bold") ? "bg-main-blue/25" : "",
          "text-gray-300 p-1.5 rounded-sm",
        )}
      >
        <Bold size={17} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={classNames(
          editor.isActive("italic") ? "bg-main-blue/25 " : "",
          "text-gray-300 p-1.5 rounded-sm",
        )}
      >
        <Italic size={17} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={classNames(
          editor.isActive("strike") ? "bg-main-blue/25 " : "",
          "text-gray-300 p-1.5 rounded-sm",
        )}
      >
        <Strikethrough size={17} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={classNames(
          editor.isActive("bulletList") ? "bg-main-blue/25 " : "",
          "text-gray-300 p-1.5 rounded-sm",
        )}
      >
        <List size={17} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={classNames(
          editor.isActive("orderedList") ? "bg-main-blue/25 " : "",
          "text-gray-300 p-1.5 rounded-sm",
        )}
      >
        <ListOrdered size={17} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={classNames(
          editor.isActive("heading", { level: 2 }) ? "bg-main-blue/25 " : "",
          "text-gray-300 p-1.5 rounded-sm",
        )}
      >
        <Heading2 size={17} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setHardBreak().run()}
        className="text-gray-300 p-1.5 rounded-sm"
      >
        <CornerDownLeft size={17} />
      </button>
    </div>
  );
};
