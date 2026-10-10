import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LikeService {
  constructor(private prisma: PrismaService) {}

  async createLike(userId: number, postId: number) {
    const postExists = await this.prisma.post.findUnique({
      where: { id: postId },
      select: { id: true },
    });
    if (!postExists) {
      throw new NotFoundException('Post not found');
    }

    return this.prisma.like.upsert({
      where: { userId_postId: { userId, postId } },
      create: { userId, postId },
      update: {},
    });
  }

  async deleteLike(userId: number, postId: number) {
    await this.prisma.like.deleteMany({ where: { userId, postId } });
  }
}
