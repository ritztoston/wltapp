import { Prisma } from "@prisma/client";

import { prisma } from "~/db.server";

interface Create {
  name: string;
  userId: string;
}

export const createClassroom = async ({ name, userId }: Create) => {
  try {
    return await prisma.classroom.create({
      data: {
        name: name,
        createdAt: new Date().toISOString(),
        active: true,
        userId: userId,
      },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        const error: Record<string, string> = {
          name: "A classroom with this name already exists.",
        };

        return error;
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
    return await prisma.studentOnClassroom.create({
      data: {
        classroomId: classroomId,
        studentId: studentId,
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
          userId: id,
        },
        {
          StudentOnClassroom: {
            some: {
              studentId: id,
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
      StudentOnClassroom: {
        include: {
          student: true,
        },
      },
      User: true,
    },
  });
};
