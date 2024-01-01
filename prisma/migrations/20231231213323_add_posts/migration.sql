-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "createdAt" TEXT NOT NULL,
    "updatedAt" TEXT,
    "authorId" TEXT NOT NULL,
    CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_ClassroomToPost" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_ClassroomToPost_A_fkey" FOREIGN KEY ("A") REFERENCES "Classroom" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ClassroomToPost_B_fkey" FOREIGN KEY ("B") REFERENCES "Post" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_PostReply" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_PostReply_A_fkey" FOREIGN KEY ("A") REFERENCES "Post" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_PostReply_B_fkey" FOREIGN KEY ("B") REFERENCES "Post" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_ClassroomToPost_AB_unique" ON "_ClassroomToPost"("A", "B");

-- CreateIndex
CREATE INDEX "_ClassroomToPost_B_index" ON "_ClassroomToPost"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PostReply_AB_unique" ON "_PostReply"("A", "B");

-- CreateIndex
CREATE INDEX "_PostReply_B_index" ON "_PostReply"("B");
