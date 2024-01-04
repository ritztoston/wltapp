import { Prisma } from "@prisma/client";
import { Auth0Profile } from "remix-auth-auth0";

import { prisma } from "~/db.server";

export type { User } from "@prisma/client";

export type UserWithClassrooms = Prisma.UserGetPayload<{
  include: {
    moderated: true;
  };
}>;

export const upsertUser = (profile: Auth0Profile, onBoarding: boolean) => {
  return prisma.user.upsert({
    where: { auth0Id: profile.id },
    update: {
      image: profile._json!.picture!,
    },
    create: {
      email: profile._json!.email!,
      firstName: profile._json!.given_name || "",
      lastName: profile._json!.family_name || "",
      auth0Id: profile.id!,
      image: profile._json!.picture!,
      createdAt: new Date().toISOString(),
      onBoarding: onBoarding,
    },
    include: {
      moderated: {
        take: 5,
        where: {
          active: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
};

export const updateUser = (id: string, firstName: string, lastName: string) => {
  return prisma.user.update({
    where: { id: id },
    data: {
      firstName: firstName,
      lastName: lastName,
      onBoarding: true,
    },
  });
};

export const getUser = (id: string) => {
  return prisma.user.findUnique({
    where: { id: id },
  });
};
