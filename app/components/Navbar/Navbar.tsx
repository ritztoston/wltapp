import { Dialog, Transition } from "@headlessui/react";
import {
  UsersIcon,
  XMarkIcon,
  SquaresPlusIcon,
} from "@heroicons/react/24/outline";
import {
  Form,
  Link,
  useLocation,
  useNavigation,
  useSubmit,
} from "@remix-run/react";
import {
  Dispatch,
  FormEvent,
  ForwardRefExoticComponent,
  Fragment,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import * as z from "zod";

import Logo from "~/assets/classmaster.png";
import { classNames, validationAction } from "~/utilities";
import { useUser } from "~/utilities/auth";

import { InputField } from "../Fields/InputField";
import { InputModal } from "../Modals/InputModal";

import { ClassroomNavbar } from "./ClassroomNavbar";
import { UserLogoutCard } from "./UserLogoutCard";

interface Fields {
  code: string;
}

const schema = z.object({
  code: z.string().min(1, "Code is required."),
});

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
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>();
  const [navigation, setNavigation] = useState<Nav[]>(navList);

  const location = useLocation();
  const submit = useSubmit();
  const transition = useNavigation();
  const isSubmitting = transition.state === "submitting";

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

  const handleJoinClassroom = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Clear errors on submit
    setErrors({});

    const formData = new FormData(event.currentTarget);
    const code = formData.get("code") as string;

    const action = validationAction<Fields>({
      body: {
        code,
      },
      schema: schema,
    });

    if (action.errors) {
      return setErrors(action.errors);
    }

    setOpen(false);

    submit(formData, {
      method: "post",
      action: "/classrooms/join".concat("?path=", location.pathname),
    });
  };

  const handleCancel = () => {
    setErrors({});
    setOpen(false);
  };

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
                <li>
                  <button
                    className="group flex gap-x-3 rounded-md p-4 leading-6 font-semibold text-white bg-main-blue w-full hover:shadow-xl hover:shadow-main-blue/50 active:bg-main-blue/90"
                    onClick={() => setOpen(true)}
                  >
                    <SquaresPlusIcon
                      className="h-6 w-6 shrink-0"
                      aria-hidden="true"
                    />
                    Join a Classroom
                  </button>
                </li>
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

      <InputModal open={open} setOpen={handleCancel}>
        <Form method="post" onSubmit={handleJoinClassroom}>
          <div className="sm:flex sm:items-start">
            <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gray-800 sm:mx-0 sm:h-10 sm:w-10">
              <SquaresPlusIcon className="h-8 w-18 text-gray-300" />
            </div>
            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
              <Dialog.Title
                as="h3"
                className="text-xl font-bold leading-6 text-main-blue"
              >
                Join a Classroom
              </Dialog.Title>
            </div>
          </div>
          <div className="mt-6 flex">
            <InputField
              className="grow"
              name="code"
              placeholder="Class code"
              error={errors?.code}
              disabled={isSubmitting}
            />
          </div>
          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button
              disabled={isSubmitting}
              className="disabled:bg-gray-500 disabled:text-gray-300 inline-flex w-full justify-center rounded-md bg-main-blue px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-main-blue/90 sm:ml-3 sm:w-auto"
            >
              {isSubmitting ? (
                <svg
                  aria-hidden="true"
                  role="status"
                  className="inline w-6 h-6 text-gray-300 animate-spin fill-main-blue"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
              ) : (
                "Submit"
              )}
            </button>
            {!isSubmitting ? (
              <button
                type="button"
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-0 hover:bg-gray-500 hover:text-white sm:mt-0 sm:w-auto"
                onClick={handleCancel}
              >
                Cancel
              </button>
            ) : null}
          </div>
        </Form>
      </InputModal>
    </>
  );
};
