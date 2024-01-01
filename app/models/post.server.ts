import { prisma } from "~/db.server";

export const createPost = async (
  content: string,
  classroomId: string,
  userId: string,
) => {
  try {
    return await prisma.post.create({
      data: {
        content: content,
        createdAt: new Date().toISOString(),
        authorId: userId,
        classrooms: {
          connect: {
            id: classroomId,
          },
        },
      },
    });
  } catch (e) {
    throw e;
  }
};
