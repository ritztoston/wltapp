import { Bars3Icon } from "@heroicons/react/20/solid";
import { ReactNode, useState } from "react";

import { Navbar } from "./Navbar/Navbar";
import { TitleBar } from "./Navbar/TitleBar";

interface LocalProps {
  children: ReactNode;
  title?: string;
  sidebar?: ReactNode;
  isInfiniteScrolling?: boolean;
}

export const Content = (props: LocalProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <div className="flex">
        <div className="w-0 lg:w-64 xl:w-80 flex-none border-r border-gray-600 flex flex-col min-h-screen h-screen z-20 transition-all ease-in-out duration-300">
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
                <TitleBar title={props.title} />

                {!props.isInfiniteScrolling ? (
                  <div className="hide-scrollbar px-6 py-12 xl:px-24 2xl:px-40 lg:py-4 xl:py-10 overflow-y-auto">
                    {props.children}
                  </div>
                ) : (
                  props.children
                )}
              </div>
              {props.sidebar ? (
                <div className="hide-scrollbar overflow-y-auto border-l border-gray-600 z-20 w-0 lg:w-64 xl:w-80 transition-all ease-in-out duration-300">
                  <div className="sm:px-6 px-8 py-6">{props.sidebar}</div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
