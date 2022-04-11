/*
  Warnings:

  - You are about to drop the column `postId` on the `CommentVote` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "CommentVote" DROP CONSTRAINT "CommentVote_postId_fkey";

-- AlterTable
ALTER TABLE "CommentVote" DROP COLUMN "postId";
