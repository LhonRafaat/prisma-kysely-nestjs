/*
  Warnings:

  - You are about to drop the `posts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `posts` DROP FOREIGN KEY `posts_author_id_fkey`;

-- DropTable
DROP TABLE `posts`;
