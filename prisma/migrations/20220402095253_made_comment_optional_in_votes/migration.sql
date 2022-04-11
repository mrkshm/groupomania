-- DropForeignKey
ALTER TABLE "Vote" DROP CONSTRAINT "Vote_commentId_fkey";

-- AlterTable
ALTER TABLE "Vote" ALTER COLUMN "commentId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
