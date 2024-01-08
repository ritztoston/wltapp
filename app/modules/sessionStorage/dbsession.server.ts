import type {
  SessionData,
  SessionStorage,
  SessionIdStorageStrategy,
} from "@remix-run/node";
import { createSessionStorage } from "@remix-run/node";

import { prisma } from "~/db.server";

export const createDatabaseSessionStorage = <
  Data = SessionData,
  FlashData = Data,
>({
  cookie,
}: {
  cookie: SessionIdStorageStrategy["cookie"];
}): SessionStorage<Data, FlashData> => {
  return createSessionStorage({
    cookie,
    async createData(data, expires) {
      const exp = expires ? Math.round(expires.getTime() / 1000) : undefined;
      const session = await prisma.session.create({
        data: { ttl: exp, data: JSON.stringify(data) },
      });

      return session.id;
    },
    async readData(id) {
      const data = await prisma.session.findUnique({ where: { id } });

      if (data) {
        return JSON.parse(data.data);
      }

      return null;
    },
    async updateData(id, data, expires) {
      const exp = expires ? Math.round(expires.getTime() / 1000) : undefined;

      await prisma.session.upsert({
        where: { id },
        update: { ttl: exp, data: JSON.stringify(data) },
        create: { id, ttl: exp, data: JSON.stringify(data) },
      });
    },
    async deleteData(id) {
      await prisma.session.delete({ where: { id } });
    },
  });
};
