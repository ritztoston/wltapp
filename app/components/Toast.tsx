import { Transition } from "@headlessui/react";
import {
  CheckCircleIcon,
  XCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { useEffect, Fragment, useState, useMemo } from "react";

import { Toast as T } from "~/modules/toasts/toast.server";
import { classNames } from "~/utilities";

const DEFAULT_TIMER_DELAY = 5000;

export const Toast = ({ toast }: { toast?: T | null }) => {
  const { message, type, key } = toast || {};
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (key) {
      setShow(true);
    }
  }, [key]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, DEFAULT_TIMER_DELAY);
    return () => clearTimeout(timer);
  }, [toast]);

  const Icon = {
    success: CheckCircleIcon,
    error: XCircleIcon,
    info: XMarkIcon,
    warning: XMarkIcon,
  }[type || "success"];

  const toastClassNames = useMemo(() => {
    return classNames(
      type === "success" ? "bg-green-50" : type === "error" ? "bg-red-50" : "",
      "rounded-md p-4",
    );
  }, [type]);

  const messageClassNames = useMemo(() => {
    return classNames(
      type === "success"
        ? "text-green-800"
        : type === "error"
        ? "text-red-800"
        : "",
      "text-sm font-medium",
    );
  }, [type]);

  const buttonClassNames = useMemo(() => {
    return classNames(
      type === "success"
        ? "bg-green-50 text-green-500 hover:bg-green-100 active:bg-green-300"
        : type === "error"
        ? "bg-red-50 text-red-500 hover:bg-red-100 active:bg-red-300"
        : "",
      "inline-flex rounded-md p-1.5 focus:ring-0",
    );
  }, [type]);

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
          <div className={toastClassNames}>
            <div className="flex">
              <div className="flex-shrink-0">
                {Icon ? (
                  <Icon
                    className={`h-5 w-5 text-${
                      type === "success" ? "green" : "red"
                    }-400`}
                    aria-hidden="true"
                  />
                ) : null}
              </div>
              <div className="ml-3">
                <p className={messageClassNames}>{message}</p>
              </div>
              <div className="ml-auto pl-6 pointer-events-auto">
                <div className="-mx-1.5 -my-1.5">
                  <button
                    type="button"
                    className={buttonClassNames}
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
