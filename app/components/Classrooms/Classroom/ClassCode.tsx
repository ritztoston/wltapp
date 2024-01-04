import { ClipboardDocumentListIcon } from "@heroicons/react/24/solid";
import { Classroom } from "@prisma/client";
import { Dispatch, SetStateAction } from "react";

import { Snackbar } from "~/utilities/types";

export const ClassCode = ({
  classroom,
  setNotification,
}: {
  classroom: Classroom;
  setNotification: Dispatch<SetStateAction<Snackbar | null>>;
}) => {
  const notification: Snackbar = {
    title: "Copied to clipboard",
    type: "success",
    key: Date.now().toString(),
    close: true,
  };

  const handleCopyToClipboard = () => {
    setNotification(notification);
    navigator.clipboard.writeText(classroom.code);
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
            className="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-700 hover:bg-gray-700 active:bg-gray-800"
            onClick={handleCopyToClipboard}
          >
            <ClipboardDocumentListIcon
              className="-ml-0.5 h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </button>
        </div>
      </div>
    </div>
  );
};
