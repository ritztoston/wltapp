import { Prisma } from "@prisma/client";

import { prisma } from "~/db.server";

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
  try {
    return await prisma.classroom.create({
      data: {
        name: name,
        createdAt: new Date().toISOString(),
        active: true,
        ownerId: userId,
      },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        throw new Error("A classroom with this name already exists.");
      }
    }
    throw e;
  }
};

export const joinClassroom = async (
  classroomId: string,
  studentId: string,
  moderatorId: string,
) => {
  if (studentId === moderatorId)
    return "You are the moderator of this classroom";

  try {
    return await prisma.classroom.update({
      where: {
        id: classroomId,
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
        return "You are already on this classroom.";
      }
    }
    throw e;
  }
};

export const getClassrooms = async (id: string) => {
  return prisma.classroom.findMany({
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
  });
};

export const getClassroomByName = async (name: string) => {
  return prisma.classroom.findUnique({
    where: {
      name: name,
    },
    include: {
      posts: {
        include: {
          author: true,
        },
      },
      students: true,
      owner: true,
    },
  });
};
