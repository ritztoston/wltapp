-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "auth0Id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "createdAt" TEXT NOT NULL,
    "onBoarding" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_User" ("auth0Id", "createdAt", "email", "firstName", "id", "image", "lastName") SELECT "auth0Id", "createdAt", "email", "firstName", "id", "image", "lastName" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_auth0Id_key" ON "User"("auth0Id");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
