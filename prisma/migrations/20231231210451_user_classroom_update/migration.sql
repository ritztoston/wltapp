/*
  Warnings:

  - You are about to drop the `_ClassroomToUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `userId` on the `Classroom` table. All the data in the column will be lost.
  - Added the required column `ownerId` to the `Classroom` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "_ClassroomToUser_B_index";

-- DropIndex
DROP INDEX "_ClassroomToUser_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_ClassroomToUser";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "_Students" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_Students_A_fkey" FOREIGN KEY ("A") REFERENCES "Classroom" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_Students_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Classroom" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    CONSTRAINT "Classroom_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Classroom" ("active", "createdAt", "id", "name") SELECT "active", "createdAt", "id", "name" FROM "Classroom";
DROP TABLE "Classroom";
ALTER TABLE "new_Classroom" RENAME TO "Classroom";
CREATE UNIQUE INDEX "Classroom_name_key" ON "Classroom"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "_Students_AB_unique" ON "_Students"("A", "B");

-- CreateIndex
CREATE INDEX "_Students_B_index" ON "_Students"("B");
