import { prisma } from "~/db.server";

export const createPost = async (
  content: string,
  classroomId: string,
  userId: string,
) => {
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
};

export const upsertPost = async (
  content: string,
  classroomId: string,
  userId: string,
  postId?: string,
) => {
  return await prisma.post.upsert({
    where: {
      id: postId,
    },
    update: {
      content: content,
      updatedAt: new Date().toISOString(),
    },
    create: {
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
};
