import { Transition } from "@headlessui/react";
import {
  CheckCircleIcon,
  XCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { useEffect, Fragment, useState } from "react";

import { Toast as T } from "~/toast.server";
import { classNames } from "~/utilities";

const DEFAULT_TIMER_DELAY = 5000;

export const Toast = ({ toast }: { toast?: T | null }) => {
  const { message, type } = toast || {};
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (toast) {
      setShow(true);
    }
  }, [toast]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, DEFAULT_TIMER_DELAY);
    return () => clearTimeout(timer);
  }, [toast]);

  return toast ? (
    <div
      aria-live="assertive"
      className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 z-50"
    >
      <div className="flex w-full flex-col items-center space-y-4">
        <Transition
          show={show}
          as={Fragment}
          enter="transform ease-out duration-300 transition"
          enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
          enterTo="translate-y-0 opacity-100 sm:translate-x-0"
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className={classNames(
              type === "success"
                ? "bg-green-50"
                : type === "error"
                ? "bg-red-50"
                : "",
              "rounded-md p-4",
            )}
          >
            <div className="flex">
              <div className="flex-shrink-0">
                {type === "success" ? (
                  <CheckCircleIcon
                    className="h-5 w-5 text-green-400"
                    aria-hidden="true"
                  />
                ) : type === "error" ? (
                  <XCircleIcon
                    className="h-5 w-5 text-red-400"
                    aria-hidden="true"
                  />
                ) : null}
              </div>
              <div className="ml-3">
                <p
                  className={classNames(
                    type === "success"
                      ? "text-green-800"
                      : type === "error"
                      ? "text-red-800"
                      : "",
                    "text-sm font-medium",
                  )}
                >
                  {message}
                </p>
              </div>
              <div className="ml-auto pl-6 pointer-events-auto">
                <div className="-mx-1.5 -my-1.5">
                  <button
                    type="button"
                    className={classNames(
                      type === "success"
                        ? "bg-green-50 text-green-500 hover:bg-green-100 active:bg-green-300"
                        : type === "error"
                        ? "bg-red-50 text-red-500 hover:bg-red-100 active:bg-red-300"
                        : "",
                      "inline-flex rounded-md p-1.5 focus:ring-0",
                    )}
                    onClick={() => setShow(false)}
                  >
                    <span className="sr-only">Dismiss</span>
                    <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  ) : null;
};
