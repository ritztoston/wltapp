import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  json,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import { ReactNode } from "react";

import stylesheet from "~/tailwind.css";

import { NotFound } from "./components/NotFound";
import { Toast } from "./components/Toast";
import { popToast } from "./toast.server";
import { getUserSession } from "./utilities/auth";

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
  { rel: "stylesheet", href: stylesheet },
  {
    rel: "android-chrome-192x192",
    sizes: "192x192",
    href: "/android-chrome-192x192.png",
  },
  {
    rel: "android-chrome-512x512",
    sizes: "512x512",
    href: "/android-chrome-512x512.png",
  },
  {
    rel: "apple-touch-icon",
    sizes: "180x180",
    href: "/apple-touch-icon.png",
  },
  {
    rel: "icon",
    type: "image/png",
    sizes: "32x32",
    href: "/favicon-32x32.png",
  },
  {
    rel: "icon",
    type: "image/png",
    sizes: "16x16",
    href: "/favicon-16x16.png",
  },
  {
    rel: "icon",
    type: "image/x-icon",
    href: "/favicon.ico",
  },
  { rel: "manifest", href: "/site.webmanifest" },
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await getUserSession(request);
  const { toast, headers } = await popToast(request);

  return json({ user, toast }, { headers });
};

export default function App() {
  const { toast } = useLoaderData<typeof loader>();

  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="icon" href="./assets/favicon.ico" />
        <Meta />
        <Links />
      </head>
      <body className="h-full bg-gray-800 overflow-hidden">
        <Toast toast={toast} />
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

const ErrorBoundaryProvider = ({
  title = "Oops!",
  children,
}: {
  title?: string;
  children: ReactNode;
}) => {
  return (
    <html lang="en" className="h-full">
      <head>
        <title>{title}</title>
        <Meta />
        <Links />
      </head>
      <body className="h-full bg-gray-800">
        {children}
        <ScrollRestoration getKey={(location) => location.pathname} />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
};

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    switch (error.status) {
      case 404: {
        return (
          <ErrorBoundaryProvider
            title={"404".concat(" | ", error.data.error || "Oops!")}
          >
            <NotFound text={error.data.error} />
          </ErrorBoundaryProvider>
        );
      }
    }
  }

  return (
    <ErrorBoundaryProvider>
      <div className="text-red-400 bg-gray-800 p-8 h-screen">
        <h1 className="p-4">
          Error: {error instanceof Error ? error.message : "Unknown Error"}
        </h1>
      </div>
    </ErrorBoundaryProvider>
  );
}
