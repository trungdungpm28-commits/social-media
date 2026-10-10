/*
  Warnings:

  - A unique constraint covering the columns `[id,authorId]` on the table `comments` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id,authorId]` on the table `posts` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "comments_id_authorId_key" ON "comments"("id", "authorId");

-- CreateIndex
CREATE UNIQUE INDEX "posts_id_authorId_key" ON "posts"("id", "authorId");
