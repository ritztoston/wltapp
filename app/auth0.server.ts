import { Authenticator } from "remix-auth";
import { Auth0Strategy } from "remix-auth-auth0";

import { User, upsertUser } from "~/models/user.server";
import { sessionStorage } from "~/session.server";

// Create an instance of the authenticator, pass a generic with what
// strategies will return and will store in the session
export const authenticator = new Authenticator<User>(sessionStorage);

const auth0Strategy = new Auth0Strategy(
  {
    callbackURL: process.env.AUTH0_CALLBACK_URL!,
    clientID: process.env.AUTH0_CLIENT_ID!,
    clientSecret: process.env.AUTH0_SECRET_ID!,
    domain: process.env.AUTH0_TENANT!,
  },
  async ({ profile }) => {
    return await upsertUser(profile);
  },
);

authenticator.use(auth0Strategy);
