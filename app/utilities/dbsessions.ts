import { Cookie, CookieOptions, createSessionStorage } from "@remix-run/node";

import { prisma } from "~/db.server";

export const createDatabaseSessionStorage = ({
  cookie,
}: {
  cookie: Cookie | CookieOptions;
}) => {
  return createSessionStorage({
    cookie,
    async createData(data, expires) {
      const exp = expires ? Math.round(expires.getTime() / 1000) : undefined;
      const state = data["oauth2:state"] as string;
      const session = await prisma.session.create({
        data: { ttl: exp, data: state },
      });

      return session.id;
    },
    async readData(id) {
      const data = await prisma.session.findUnique({ where: { id } });
      return {
        ["oauth2:state"]: data?.data,
      };
    },
    async updateData(id, data, expires) {
      const exp = expires ? Math.round(expires.getTime() / 1000) : undefined;
      const state = data["oauth2:state"] as string;

      await prisma.session.update({
        where: { id },
        data: { ttl: exp, data: state },
      });
    },
    async deleteData(id) {
      await prisma.session.delete({ where: { id } });
    },
  });
};
