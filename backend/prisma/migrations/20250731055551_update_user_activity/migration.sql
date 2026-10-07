/*
  Warnings:

  - You are about to drop the column `timestamp` on the `useractivity` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `useractivity` DROP COLUMN `timestamp`,
    ADD COLUMN `accessedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
