import { User } from "@prisma/client";
import { ReactNode } from "react";

import { Breadcrumbs } from "./Breadcrumbs";
import { Navbar } from "./Navbar";

// import { Notification } from "~/utilities/types";

// import Notifications from "../Notifications/Notifications";

interface LocalProps {
  user: User;
  title?: string;
  children: ReactNode;
  //   notification?: Notification | null | undefined;
}

export const Content = (props: LocalProps) => {
  return (
    <div>
      <Navbar user={props.user} />
      <main className="lg:pl-72">
        <div className="xl:pr-96">
          <Breadcrumbs title={props.title} />
          <div className="px-4 py-8 sm:px-6 lg:px-20 lg:py-10 h-screen">
            {props.children}
          </div>
        </div>
      </main>

      <aside className="fixed inset-y-0 right-0 hidden w-96 overflow-y-auto shadow-2xl px-4 py-6 sm:px-6 lg:px-8 xl:block bg-gray-800 z-20">
        {/* Secondary column (hidden on smaller screens) */}
      </aside>

      {/* {props.notification ? (
        <Notifications
          title={props.notification.title}
          description={props.notification.description}
        />
      ) : null} */}
    </div>
  );
};
