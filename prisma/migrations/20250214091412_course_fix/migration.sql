/*
  Warnings:

  - You are about to drop the column `coruse_name` on the `Course` table. All the data in the column will be lost.
  - Added the required column `course_name` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Course` DROP COLUMN `coruse_name`,
    ADD COLUMN `course_name` VARCHAR(191) NOT NULL;
