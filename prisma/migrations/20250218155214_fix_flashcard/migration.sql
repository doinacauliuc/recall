/*
  Warnings:

  - You are about to drop the column `course_id` on the `FlashcardSet` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `FlashcardSet` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `FlashcardSet_course_id_fkey` ON `FlashcardSet`;

-- AlterTable
ALTER TABLE `FlashcardSet` DROP COLUMN `course_id`,
    ADD COLUMN `user_id` INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX `FlashcardSet_user_id_fkey` ON `FlashcardSet`(`user_id`);

-- AddForeignKey
ALTER TABLE `FlashcardSet` ADD CONSTRAINT `FlashcardSet_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
