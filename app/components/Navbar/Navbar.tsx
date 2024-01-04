import { Dialog, Transition } from "@headlessui/react";
import { UsersIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link, useLocation } from "@remix-run/react";
import {
  Dispatch,
  ForwardRefExoticComponent,
  Fragment,
  SetStateAction,
  useEffect,
  useState,
} from "react";

import Logo from "~/assets/classmaster.png";
import { classNames } from "~/utilities";
import { useUser } from "~/utilities/auth";

import { ClassroomNavbar } from "./ClassroomNavbar";
import { UserLogoutCard } from "./UserLogoutCard";

interface Nav {
  name: string;
  href: string;
  current: boolean;
  icon: ForwardRefExoticComponent<
    Omit<React.SVGProps<SVGSVGElement>, "ref"> & {
      title?: string | undefined;
      titleId?: string | undefined;
    } & React.RefAttributes<SVGSVGElement>
  >;
}

const navList: Nav[] = [
  // { name: "Home", href: "/home", icon: HomeIcon, current: false },
  {
    name: "Home",
    href: "/classrooms",
    icon: UsersIcon,
    current: false,
  },
];

export const Navbar = ({
  sidebarOpen,
  setSidebarOpen,
}: {
  sidebarOpen: boolean;
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const user = useUser();
  const [navigation, setNavigation] = useState<Nav[]>(navList);
  const location = useLocation();

  useEffect(() => {
    // Get current path
    const path = location.pathname;
    // Set current path to true or false
    setNavigation((prev) => {
      return prev.map((item) => {
        const firstPath = path.split("/")[1];
        const href = item.href.split("/")[1];
        return {
          ...item,
          current: href === firstPath,
        };
      });
    });
  }, [location.pathname]);

  return (
    <>
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-40 lg:hidden"
          onClose={setSidebarOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                    <button
                      type="button"
                      className="-m-2.5 p-2.5"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </Transition.Child>
                {/* Sidebar component, swap this element with another sidebar if you like */}
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-800 px-6 pb-2">
                  <div className="flex h-16 shrink-0 items-center">
                    <img className="h-8 w-auto" src={Logo} alt="wltoston" />
                  </div>
                  <nav className="flex flex-1 flex-col">
                    <ul className="flex flex-1 flex-col gap-y-7">
                      <li>
                        <ul className="-mx-2 space-y-2">
                          {navigation.map((item) => (
                            <li key={item.name}>
                              <Link
                                to={item.href}
                                className={classNames(
                                  item.current
                                    ? "text-main-blue"
                                    : "text-gray-300 hover:text-white hover:bg-main-blue/50",
                                  "group flex gap-x-3 rounded-md p-4 text-sm leading-6 font-semibold",
                                )}
                              >
                                <item.icon
                                  className={classNames(
                                    item.current
                                      ? "text-main-blue"
                                      : "text-gray-400 group-hover:text-white",
                                    "h-6 w-6 shrink-0",
                                  )}
                                  aria-hidden="true"
                                />
                                {item.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </li>
                      {user.moderated.length ? (
                        <li>
                          <ClassroomNavbar classrooms={user.moderated} />
                        </li>
                      ) : null}
                      <li className="-mx-6 mt-auto">
                        <UserLogoutCard user={user} />
                      </li>
                    </ul>
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-800 px-0 lg:px-6 transition-all ease-in-out duration-300">
        <div className="flex h-16 shrink-0 items-center">
          <img className="h-8 w-auto" src={Logo} alt="wltoston" />
        </div>
        <nav className="flex flex-1 flex-col">
          <ul className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul className="-mx-2 space-y-2">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={classNames(
                        item.current
                          ? "text-main-blue"
                          : "text-gray-300 hover:text-white hover:bg-main-blue/50",
                        "group flex gap-x-3 rounded-md p-4 leading-6 font-semibold",
                      )}
                    >
                      <item.icon
                        className={classNames(
                          item.current
                            ? "text-main-blue"
                            : "text-gray-400 group-hover:text-white",
                          "h-6 w-6 shrink-0",
                        )}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            {user.moderated.length ? (
              <li>
                <ClassroomNavbar classrooms={user.moderated} />
              </li>
            ) : null}
            <li className="-mx-6 mt-auto">
              <UserLogoutCard user={user} />
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};
