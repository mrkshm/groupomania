/*
  Warnings:

  - A unique constraint covering the columns `[userId,commentId]` on the table `CommentVote` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "CommentVote_userId_postId_commentId_key";

-- CreateIndex
CREATE UNIQUE INDEX "CommentVote_userId_commentId_key" ON "CommentVote"("userId", "commentId");
