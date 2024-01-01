/*
  Warnings:

  - You are about to drop the `StudentOnClassroom` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "StudentOnClassroom";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "_ClassroomToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_ClassroomToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Classroom" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ClassroomToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Classroom" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TEXT NOT NULL,
    "userId" TEXT NOT NULL
);
INSERT INTO "new_Classroom" ("active", "createdAt", "id", "name", "userId") SELECT "active", "createdAt", "id", "name", "userId" FROM "Classroom";
DROP TABLE "Classroom";
ALTER TABLE "new_Classroom" RENAME TO "Classroom";
CREATE UNIQUE INDEX "Classroom_name_key" ON "Classroom"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "_ClassroomToUser_AB_unique" ON "_ClassroomToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_ClassroomToUser_B_index" ON "_ClassroomToUser"("B");
