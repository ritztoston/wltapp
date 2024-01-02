import { Dialog, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  HomeIcon,
  UsersIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Form, Link, useLocation } from "@remix-run/react";
import {
  ForwardRefExoticComponent,
  Fragment,
  useEffect,
  useState,
} from "react";

import Logo from "~/assets/classmaster.png";
import { classNames, getUserFullName } from "~/utilities";
import { useUser } from "~/utilities/auth";

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
  { name: "Home", href: "/home", icon: HomeIcon, current: false },
  {
    name: "Classrooms",
    href: "/classrooms",
    icon: UsersIcon,
    current: false,
  },
];

// const teams = [
//   { id: 1, name: "Heroicons", href: "#", initial: "H", current: false },
//   { id: 2, name: "Tailwind Labs", href: "#", initial: "T", current: false },
// ];

export const Navbar = () => {
  const user = useUser();
  const [navigation, setNavigation] = useState<Nav[]>(navList);
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
                      {/* <li>
                        <div className="text-xs font-semibold leading-6 text-gray-400">
                          Your teams
                        </div>
                        <ul className="-mx-2 mt-2 space-y-1">
                          {teams.map((team) => (
                            <li key={team.name}>
                              <a
                                href={team.href}
                                className={classNames(
                                  team.current
                                    ? "bg-gray-50 text-indigo-600"
                                    : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50",
                                  "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold",
                                )}
                              >
                                <span
                                  className={classNames(
                                    team.current
                                      ? "text-indigo-600 border-indigo-600"
                                      : "text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600",
                                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white",
                                  )}
                                >
                                  {team.initial}
                                </span>
                                <span className="truncate">{team.name}</span>
                              </a>
                            </li>
                          ))}
                        </ul>
                      </li> */}
                    </ul>
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-40 lg:flex lg:w-72 lg:flex-col">
        {/* Sidebar component, swap this element with another sidebar if you like */}
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-800 px-6 shadow-2xl">
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
              {/* <li>
                <div className="text-xs font-semibold leading-6 text-gray-400">
                  Your classrooms
                </div>
                <ul className="-mx-2 mt-2 space-y-1">
                  {teams.map((team) => (
                    <li key={team.name}>
                      <a
                        href={team.href}
                        className={classNames(
                          team.current
                            ? "bg-gray-50 text-indigo-600"
                            : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50",
                          "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold",
                        )}
                      >
                        <span
                          className={classNames(
                            team.current
                              ? "text-indigo-600 border-indigo-600"
                              : "text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600",
                            "flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white",
                          )}
                        >
                          {team.initial}
                        </span>
                        <span className="truncate">{team.name}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </li> */}
              <li className="-mx-6 mt-auto">
                <div className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-300">
                  <img
                    className="h-11 w-11 rounded-full"
                    src={user.image}
                    alt={getUserFullName(user.firstName, user.lastName)}
                  />
                  <div>
                    <div aria-hidden="true">
                      {getUserFullName(user.firstName, user.lastName)}
                    </div>
                    <div aria-hidden="true">
                      <Form action="/logout" method="post">
                        <button className="items-center flex w-full flex-none gap-x-2 text-red-400 hover:text-red-500 font-medium">
                          <dt className="flex-none">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-4 h-4"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
                              />
                            </svg>
                          </dt>
                          <dd className="text-sm">Sign out</dd>
                        </button>
                      </Form>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-gray-800 px-4 py-4 sm:px-6 lg:hidden shadow-lg">
        <button
          type="button"
          className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          <Bars3Icon className="h-6 w-6 text-white" aria-hidden="true" />
        </button>
        <span>
          <img
            className="h-8 w-8 rounded-full bg-gray-50"
            src={user.image}
            alt={getUserFullName(user.firstName, user.lastName)}
          />
        </span>
      </div>
    </>
  );
};
