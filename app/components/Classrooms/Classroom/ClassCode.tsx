import {
  ClipboardDocumentIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/solid";
import { Classroom } from "@prisma/client";
import { useState } from "react";

export const ClassCode = ({ classroom }: { classroom: Classroom }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(classroom.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-lg grid grid-cols-1 gap-4 border border-gray-700 p-4 text-gray-300">
      <div>Class code</div>
      <div>
        <div className="mt-2 flex rounded-md shadow-sm">
          <div className="relative focus-within:z-10">
            <input
              disabled
              type="text"
              className="truncate bg-gray-800 block w-full rounded-none rounded-l-md border-0 py-1.5 text-gray-300 ring-1 ring-inset ring-gray-700 placeholder:text-gray-400 sm:text-sm sm:leading-6"
              defaultValue={classroom.code}
            />
          </div>
          <button
            type="button"
            className="transition ease-in-out duration-300 relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-700 hover:bg-gray-700 active:bg-gray-800"
            onClick={handleCopyCode}
          >
            {copied ? (
              <CheckCircleIcon
                className="-ml-0.5 h-5 w-5 text-green-300"
                aria-hidden="true"
              />
            ) : (
              <ClipboardDocumentIcon
                className="-ml-0.5 h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
