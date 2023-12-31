import { Auth0Profile } from "remix-auth-auth0";

import { prisma } from "~/db.server";

export type { User } from "@prisma/client";

export const upsertUser = (profile: Auth0Profile) => {
  return prisma.user.upsert({
    where: { auth0Id: profile.id },
    update: {
      image: profile._json!.picture!,
    },
    create: {
      email: profile._json!.email!,
      firstName: profile._json!.given_name!,
      lastName: profile._json!.family_name!,
      auth0Id: profile.id!,
      image: profile._json!.picture!,
      createdAt: new Date().toISOString(),
    },
  });
};
