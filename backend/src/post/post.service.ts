import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto, EditPostDto } from './dto';
import { create } from 'node:domain';
import { PrismaClient } from '@prisma/client/extension';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { throwError } from 'rxjs';

const hashtagRegex = /(?:^|\s)#([a-zA-Z0-9_]+)/g;

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}
  getAllPosts() {
    return this.prisma.post.findMany({ orderBy: { createdAt: 'desc' } });
  }

  getPostById(postId: number) {
    return this.prisma.post.findMany({ where: { id: postId } });
  }

  async createPost(userId: number, dto: CreatePostDto) {
    const matches = dto.content.matchAll(hashtagRegex);

    const tagNames = Array.from(
      new Set(Array.from(matches, (m) => m[1].toLocaleLowerCase())),
    );

    return await this.prisma.post.create({
      data: {
        authorId: userId,
        title: dto.title,
        content: dto.content,
        thumbnail: dto.thumbnail,
        tags: {
          connectOrCreate: tagNames.map((name) => ({
            where: { name },
            create: { name },
          })),
        },
      },
      include: {
        tags: true,
      },
    });
  }

  async editPostById(userId: number, postId: number, dto: EditPostDto) {
    const matches = dto.content.matchAll(hashtagRegex);
    const tagNames = Array.from(
      new Set(Array.from(matches, (m) => m[1].toLocaleLowerCase())),
    );
    try {
      return this.prisma.post.update({
        where: {
          id_authorId: {
            id: postId,
            authorId: userId,
          },
        },
        data: {
          authorId: userId,
          title: dto.title,
          content: dto.content,
          thumbnail: dto.thumbnail,
          tags: {
            set: [],
            connectOrCreate: tagNames.map((name) => ({
              where: { name },
              create: { name },
            })),
          },
        },
        include: {
          tags: true,
        },
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

  async deletePostById(userId: number, postId: number) {
    try {
      await this.prisma.post.delete({
        where: {
          id_authorId: {
            id: postId,
            authorId: userId,
          },
        },
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
