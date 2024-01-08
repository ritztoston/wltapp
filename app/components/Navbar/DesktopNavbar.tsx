import { SquaresPlusIcon } from "@heroicons/react/24/solid";
import { Link } from "@remix-run/react";
import { Dispatch, SetStateAction } from "react";

import Logo from "~/assets/classmaster.png";
import { useUser } from "~/modules/auth0/auth";
import { classNames } from "~/utilities";

import { ClassroomNavbar } from "./ClassroomNavbar";
import { Nav } from "./Navbar";
import { UserLogoutCard } from "./UserLogoutCard";

interface LocalProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
  navigation: Nav[];
}

export const DesktopNavbar = ({ setOpen, navigation }: LocalProps) => {
  const user = useUser();
  return (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-800 px-0 lg:px-6 transition-all ease-in-out duration-300">
      <div className="flex h-16 shrink-0 items-center">
        <img className="h-8 w-auto" src={Logo} alt="wltoston" />
      </div>
      <nav className="flex flex-1 flex-col">
        <ul className="flex flex-1 flex-col gap-y-7">
          <li>
            <button
              className="group flex gap-x-3 rounded-full justify-center p-4 leading-6 font-semibold text-white bg-main-blue w-full drop-shadow-lg hover:shadow-md hover:shadow-main-blue/50 active:bg-main-blue/90"
              onClick={() => setOpen(true)}
            >
              <SquaresPlusIcon
                className="h-6 w-6 shrink-0"
                aria-hidden="true"
              />
              Join a Classroom
            </button>
          </li>
          <li>
            <ul className="-mx-2 space-y-2">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={classNames(
                      item.current
                        ? "text-main-blue hover:text-white"
                        : "text-gray-300 hover:text-white hover:bg-main-blue/50",
                      "group flex gap-x-3 rounded-md p-2 leading-6 font-semibold",
                    )}
                  >
                    <item.icon
                      className={classNames(
                        item.current
                          ? "text-main-blue group-hover:text-white"
                          : "text-gray-400 group-hover:text-white",
                        "h-6 w-6 shrink-0 group-active:text-gray-400",
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
          {user.moderated.length && user.moderated.length > 3 ? (
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
  );
};
