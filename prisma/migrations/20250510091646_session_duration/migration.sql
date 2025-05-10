/*
  Warnings:

  - Added the required column `duration` to the `StudySession` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `StudySession` ADD COLUMN `duration` INTEGER NOT NULL;
