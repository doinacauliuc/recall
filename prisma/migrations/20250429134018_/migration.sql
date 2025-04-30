/*
  Warnings:

  - You are about to drop the column `knowledge` on the `Flashcard` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Flashcard` DROP COLUMN `knowledge`,
    ADD COLUMN `knowledge_level` INTEGER NOT NULL DEFAULT 0;
