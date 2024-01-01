import { User } from "@prisma/client";
import { ReactNode } from "react";

import { classNames } from "~/utilities";

import { Breadcrumbs } from "./Breadcrumbs";
import { Navbar } from "./Navbar";
import { Snackbar } from "~/utilities/types";
import Notifications from "./Notifications";

// import { Notification } from "~/utilities/types";

// import Notifications from "../Notifications/Notifications";

interface LocalProps {
  user: User;
  children: ReactNode;
  title?: string;
  sidebar?: ReactNode;
  notification?: Snackbar | null;
}

export const Content = (props: LocalProps) => {
  return (
    <div>
      <Navbar user={props.user} />
      <main className="lg:pl-72">
        <div className={classNames(props.sidebar ? "xl:pr-80" : "", "")}>
          <Breadcrumbs title={props.title} />
          <div className="px-4 py-8 sm:px-6 lg:px-20 lg:py-10">
            {props.children}
          </div>
        </div>
      </main>

      {props.sidebar ? (
        <aside className="fixed inset-y-0 right-0 hidden w-80 overflow-y-auto shadow-2xl px-4 py-6 sm:px-6 lg:px-8 xl:block bg-gray-800 z-20">
          {props.sidebar}
        </aside>
      ) : null}

      {props.notification ? (
        <Notifications
          title={props.notification.title}
          description={props.notification.description}
          type={props.notification.type}
        />
      ) : null}
    </div>
  );
};
