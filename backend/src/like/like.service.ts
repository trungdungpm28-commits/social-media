import { ForbiddenException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class LikeService {
  constructor(private prisma: PrismaService) {}

  async createLike(userId: number, postId: number) {
    return await this.prisma.like.create({
      data: {
        userId: userId,
        postId: postId,
      },
    });
  }

  async deleteLike(userId: number, postId: number) {
    try {
      return this.prisma.post.delete({
        where: {
          id: postId,
          authorId: userId,
        }
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new ForbiddenException('Access to resources denied');
      }
      throw error;
    }
  }
}
