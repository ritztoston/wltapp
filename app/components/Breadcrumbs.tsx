import { ChevronRightIcon, HomeIcon } from "@heroicons/react/20/solid";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { Link, useLocation } from "@remix-run/react";

import { capitalize, classNames } from "~/utilities";

export const Breadcrumbs = ({ title }: { title?: string }) => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <div
      className={classNames(
        pathnames.length ? "visible" : "invisible",
        "px-4 sm:px-6 lg:px-20 lg:pt-10 py-6 mx-auto max-w-7xl lg:sticky lg:top-0 lg:z-10 bg-gray-800",
      )}
    >
      <div>
        {pathnames.length > 1 ? (
          <nav className="sm:hidden" aria-label="Back">
            <Link
              to={"/".concat(pathnames[pathnames.length - 2])}
              className="flex items-center text-sm font-medium text-gray-400 hover:text-gray-200"
            >
              <ChevronLeftIcon
                className="-ml-1 mr-1 h-5 w-5 flex-shrink-0 text-gray-500"
                aria-hidden="true"
              />
              Back
            </Link>
          </nav>
        ) : null}
        <nav className="hidden sm:flex" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-4">
            <li>
              <div className="flex items-center">
                <Link
                  to="/home"
                  className="text-sm font-medium text-gray-400 hover:text-gray-200"
                  aria-current="page"
                >
                  <HomeIcon
                    className="h-4 w-4 flex-shrink-0"
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </li>
            {pathnames.map((name, index) => (
              <li key={name}>
                <div className="flex items-center">
                  <ChevronRightIcon
                    className="h-5 w-5 flex-shrink-0 text-gray-500"
                    aria-hidden="true"
                  />
                  <Link
                    to={`/${pathnames.slice(0, index + 1).join("/")}`}
                    className="ml-4 text-sm font-medium text-gray-400 hover:text-gray-200"
                    aria-current={
                      index === pathnames.length - 1 ? "page" : undefined
                    }
                  >
                    {capitalize(name)}
                  </Link>
                </div>
              </li>
            ))}
          </ol>
        </nav>
      </div>
      <div className="mt-2 md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          {title ? (
            <h2 className="text-main-blue font-extrabold text-2xl md:text-4xl leading-7 sm:truncate sm:text-3xl sm:tracking-tight">
              {title}
            </h2>
          ) : null}
        </div>
      </div>
    </div>
  );
};
