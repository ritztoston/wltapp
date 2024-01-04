import { Bars3Icon } from "@heroicons/react/20/solid";
import { ReactNode, useState } from "react";

import { Snackbar } from "~/utilities/types";

import { Breadcrumbs } from "./Breadcrumbs";
import { Navbar } from "./Navbar/Navbar";
import Notifications from "./Notifications";

interface LocalProps {
  children: ReactNode;
  title?: string;
  sidebar?: ReactNode;
  notification?: Snackbar | null;
}

export const Content = (props: LocalProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <div className="flex">
        <div className="w-0 lg:w-64 xl:w-80 flex-none shadow-2xl flex flex-col min-h-screen h-screen z-20 transition-all ease-in-out duration-300">
          <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        </div>
        <div className="flex-1 flex flex-col min-h-screen h-screen">
          <div className="flex-1 flex overflow-hidden">
            <div className="flex-1 flex justify between">
              <div className="flex-1 flex flex-col">
                <div className="z-40 items-center gap-x-6 px-4 py-4 sm:px-6 lg:hidden shadow-lg">
                  <button
                    type="button"
                    className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
                    onClick={() => setSidebarOpen(true)}
                  >
                    <Bars3Icon
                      className="h-6 w-6 text-white"
                      aria-hidden="true"
                    />
                  </button>
                </div>
                <Breadcrumbs title={props.title} />

                <div className="hide-scrollbar p-2 sm:p-8 md:px-6 lg:px-8 xl:px-24 lg:py-4 xl:py-10 overflow-y-auto">
                  {props.children}
                </div>
              </div>
              {props.sidebar ? (
                <div className="hide-scrollbar overflow-y-auto shadow-2xl z-20 w-0 lg:w-64 xl:w-80 transition-all ease-in-out duration-300">
                  <div className="sm:px-4 px-8 py-6">{props.sidebar}</div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      {props.notification ? (
        <Notifications
          title={props.notification.title}
          description={props.notification.description}
          type={props.notification.type}
        />
      ) : null}
    </>
  );
};
