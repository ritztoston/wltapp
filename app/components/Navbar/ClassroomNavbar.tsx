import { Classroom } from "@prisma/client";
import { Link } from "@remix-run/react";

import { capitalize, getInitials } from "~/utilities";

export const ClassroomNavbar = ({
  classrooms,
}: {
  classrooms: Classroom[];
}) => {
  return (
    <>
      <div className="text-xs font-semibold leading-6 text-gray-300">
        Recent classrooms
      </div>
      <ul className="-mx-2 mt-2 space-y-1">
        {classrooms.map((classroom) => (
          <li key={classroom.id}>
            <Link
              to={`/classrooms/${classroom.id}`}
              className="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-gray-400 hover:text-white hover:bg-main-blue/50"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium text-gray-400 border-gray-400 group-hover:border-main-blue group-hover:text-main-blue">
                {capitalize(getInitials(classroom.name))}
              </span>
              <span className="truncate">{capitalize(classroom.name)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
};
