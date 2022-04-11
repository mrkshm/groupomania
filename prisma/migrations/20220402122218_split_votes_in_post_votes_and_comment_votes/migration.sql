/*
  Warnings:

  - You are about to drop the `Vote` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Vote" DROP CONSTRAINT "Vote_commentId_fkey";

-- DropForeignKey
ALTER TABLE "Vote" DROP CONSTRAINT "Vote_postId_fkey";

-- DropForeignKey
ALTER TABLE "Vote" DROP CONSTRAINT "Vote_userId_fkey";

-- DropTable
DROP TABLE "Vote";

-- CreateTable
CREATE TABLE "PostVote" (
    "id" SERIAL NOT NULL,
    "value" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "postId" INTEGER NOT NULL,

    CONSTRAINT "PostVote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommentVote" (
    "id" SERIAL NOT NULL,
    "value" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "postId" INTEGER NOT NULL,
    "commentId" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "CommentVote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PostVote_userId_postId_key" ON "PostVote"("userId", "postId");

-- CreateIndex
CREATE UNIQUE INDEX "CommentVote_userId_postId_commentId_key" ON "CommentVote"("userId", "postId", "commentId");

-- AddForeignKey
ALTER TABLE "PostVote" ADD CONSTRAINT "PostVote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostVote" ADD CONSTRAINT "PostVote_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentVote" ADD CONSTRAINT "CommentVote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentVote" ADD CONSTRAINT "CommentVote_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentVote" ADD CONSTRAINT "CommentVote_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
