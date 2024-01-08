import { Dialog } from "@headlessui/react";
import { UsersIcon, SquaresPlusIcon } from "@heroicons/react/24/outline";
import { Form, useLocation, useNavigation, useSubmit } from "@remix-run/react";
import {
  Dispatch,
  FormEvent,
  ForwardRefExoticComponent,
  SetStateAction,
  useMemo,
  useState,
} from "react";

import { InputField } from "../Fields/InputField";
import { InputModal } from "../Modals/InputModal";

import { DesktopNavbar } from "./DesktopNavbar";
import { MobileNavbar } from "./MobileNavbar";

interface Fields {
  code: string;
}

export interface Nav {
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
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>();

  const submit = useSubmit();
  const transition = useNavigation();
  const isSubmitting = transition.state === "submitting";

  const navigation = useMemo(
    () =>
      navList.map((item) => {
        const firstPath = location.pathname.split("/")[1];
        const href = item.href.split("/")[1];
        return {
          ...item,
          current: href === firstPath,
        };
      }),
    [location.pathname],
  );

  const handleJoinClassroom = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Clear errors on submit
    setErrors({});

    const formData = new FormData(event.currentTarget);
    const code = formData.get("code") as string;

    if (!code || code.length < 1) {
      return setErrors({ code: "Code is required." });
    }

    setOpen(false);

    submit(formData, {
      method: "post",
      action: "/classrooms/join",
      navigate: false,
    });
  };

  const handleCancel = () => {
    setErrors({});
    setOpen(false);
  };

  return (
    <>
      <MobileNavbar
        setOpen={setOpen}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        navigation={navigation}
      />
      <DesktopNavbar setOpen={setOpen} navigation={navigation} />

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
