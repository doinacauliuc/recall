/*
  Warnings:

  - Added the required column `note_id` to the `Chat` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Chat` ADD COLUMN `note_id` INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX `Chat_user_id_note_id_fkey` ON `Chat`(`user_id`, `note_id`);

-- AddForeignKey
ALTER TABLE `Chat` ADD CONSTRAINT `Chat_note_id_fkey` FOREIGN KEY (`note_id`) REFERENCES `Note`(`note_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
