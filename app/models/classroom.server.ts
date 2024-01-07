import { Prisma } from "@prisma/client";
import { json } from "@remix-run/node";

import { prisma } from "~/db.server";
import { generateRandomCode } from "~/utilities";

interface Create {
  name: string;
  userId: string;
}

export type ClassroomWithStudents = Prisma.ClassroomGetPayload<{
  include: {
    posts: {
      include: {
        author: true;
      };
    };
    students: true;
    owner: true;
  };
}>;

export const createClassroom = async ({ name, userId }: Create) => {
  return await prisma.classroom.create({
    data: {
      name: name,
      createdAt: new Date().toISOString(),
      ownerId: userId,
      code: generateRandomCode(6),
    },
  });
};

export const joinClassroom = async (code: string, studentId: string) => {
  const classroom = await prisma.classroom.findUnique({
    where: {
      code: code,
    },
  });

  if (!classroom)
    throw json(null, {
      status: 404,
      statusText: "Classroom not found. Please check the code and try again.",
    });

  if (studentId === classroom.ownerId)
    throw new Response("You are the moderator of this classroom", {
      status: 409,
    });

  try {
    return await prisma.classroom.update({
      where: {
        code: code,
      },
      data: {
        students: {
          connect: {
            id: studentId,
          },
        },
      },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        throw new Response("You are already on this classroom.", {
          status: 409,
        });
      }
    }
    throw e;
  }
};

export const getClassrooms = async (id: string, cursor?: string | null) => {
  return prisma.classroom.findMany({
    take: cursor ? 5 : 18,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
    where: {
      OR: [
        {
          ownerId: id,
        },
        {
          students: {
            some: {
              id: id,
            },
          },
        },
      ],
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getClassroom = async (
  id: string,
  userId: string,
  cursor?: string | null,
) => {
  try {
    return await prisma.classroom.findFirstOrThrow({
      where: {
        AND: [
          {
            id: id,
          },
          {
            OR: [
              {
                students: {
                  some: {
                    id: userId,
                  },
                },
              },
              {
                ownerId: userId,
              },
            ],
          },
        ],
      },
      include: {
        posts: {
          take: cursor ? 2 : 10,
          skip: cursor ? 1 : 0,
          cursor: cursor ? { id: cursor } : undefined,
          include: {
            author: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        students: true,
        owner: true,
      },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        throw json({ error: "You are not a member of this classroom" }, 404);
      }
    }
    throw e;
  }
};
