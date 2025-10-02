/*
  Warnings:

  - You are about to drop the column `filename` on the `calleds` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_calleds" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "service" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "technical" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME,
    CONSTRAINT "calleds_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_calleds" ("amount", "created_at", "id", "name", "service", "technical", "updated_at", "user_id") SELECT "amount", "created_at", "id", "name", "service", "technical", "updated_at", "user_id" FROM "calleds";
DROP TABLE "calleds";
ALTER TABLE "new_calleds" RENAME TO "calleds";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
