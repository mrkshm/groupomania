/*
  Warnings:

  - A unique constraint covering the columns `[identifier,slug]` on the table `Post` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "body" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Post_identifier_slug_key" ON "Post"("identifier", "slug");
