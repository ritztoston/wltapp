import { Authenticator } from "remix-auth";
import { Auth0Profile, Auth0Strategy } from "remix-auth-auth0";

import { sessionStorage } from "~/session.server";

// import { findOrCreateController } from "./controllers/user";
// import { Profile } from "./utilities/types";

// Create an instance of the authenticator, pass a generic with what
// strategies will return and will store in the session
export const authenticator = new Authenticator<Auth0Profile>(sessionStorage);

const auth0Strategy = new Auth0Strategy(
    {
        callbackURL: process.env.AUTH0_CALLBACK_URL!,
        clientID: process.env.AUTH0_CLIENT_ID!,
        clientSecret: process.env.AUTH0_SECRET_ID!,
        domain: process.env.AUTH0_TENANT!,
    },
    async ({ profile }) => {
        // const user = await findOrCreateController(profile);
        
        // const payload: Profile = {
        //     ...user,
        //     image: profile._json!.picture!,
        // };

        // return payload;
        return profile
    },
);

authenticator.use(auth0Strategy);
