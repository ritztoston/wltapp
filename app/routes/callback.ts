// // import { createCookie } from "@remix-run/node";
// import type { LoaderFunction } from "@remix-run/server-runtime";

import { LoaderFunction } from "@remix-run/node";

import { authenticator } from "~/auth0.server";

// import { authenticator } from "~/auth0.server";

// export const loader: LoaderFunction = async ({ request }) => {
//     // const returnToCookie = createCookie("returnToCookie", { maxAge: 3600 });
//     // const result = await returnToCookie.parse(request.headers.get("Cookie"));
//     // const returnTo = result ?? "/";

//     return await authenticator.authenticate("auth0", request, {
//         // successRedirect: returnTo,
//         successRedirect: "/",
//         failureRedirect: "/login",
//         throwOnError: true,
//     });
// };

export const loader: LoaderFunction = ({ request }) => {
  return authenticator.authenticate("auth0", request, {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
  });
};
