/*
  Warnings:

  - You are about to drop the `_PostReply` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "_PostReply_B_index";

-- DropIndex
DROP INDEX "_PostReply_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_PostReply";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Post" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "createdAt" TEXT NOT NULL,
    "updatedAt" TEXT,
    "authorId" TEXT NOT NULL,
    "postId" TEXT,
    CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Post_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Post" ("authorId", "content", "createdAt", "id", "updatedAt") SELECT "authorId", "content", "createdAt", "id", "updatedAt" FROM "Post";
DROP TABLE "Post";
ALTER TABLE "new_Post" RENAME TO "Post";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
