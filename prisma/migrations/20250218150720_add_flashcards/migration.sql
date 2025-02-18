-- AlterTable
ALTER TABLE `Note` ADD COLUMN `deleted` BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE `FlashcardSet` (
    `set_id` INTEGER NOT NULL AUTO_INCREMENT,
    `set_name` VARCHAR(191) NOT NULL,
    `course_id` INTEGER NOT NULL,
    `creation_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `FlashcardSet_course_id_fkey`(`course_id`),
    PRIMARY KEY (`set_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Flashcard` (
    `flashcard_id` INTEGER NOT NULL AUTO_INCREMENT,
    `question` TEXT NOT NULL,
    `answer` TEXT NOT NULL,
    `creation_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `set_id` INTEGER NOT NULL,

    INDEX `Flashcard_set_id_fkey`(`set_id`),
    PRIMARY KEY (`flashcard_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Flashcard` ADD CONSTRAINT `Flashcard_set_id_fkey` FOREIGN KEY (`set_id`) REFERENCES `FlashcardSet`(`set_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
