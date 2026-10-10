import {
  ForbiddenException,
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto, EditPostDto } from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

const hashtagRegex = /(?:^|\s)#([a-zA-Z0-9_]+)/g;

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}
  getAllPosts(userId: number) {
    return this.prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
        comments: {
          orderBy: { createdAt: 'asc' },
          include: {
            author: {
              select: { id: true, email: true, firstName: true, lastName: true },
            },
          },
        },
        _count: { select: { likes: true } },
        likes: { where: { userId }, select: { id: true } },
      },
    });
  }

  async getPostById(postId: number) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
        comments: {
          orderBy: { createdAt: 'asc' },
          include: {
            author: {
              select: { id: true, email: true, firstName: true, lastName: true },
            },
          },
        },
        _count: { select: { likes: true } },
      },
    });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }

  async createPost(userId: number, dto: CreatePostDto) {
    const content = dto.content.trim();
    if (!content) {
      throw new BadRequestException('Post content cannot be empty');
    }
    const matches = content.matchAll(hashtagRegex);

    const tagNames = Array.from(
      new Set(Array.from(matches, (m) => m[1].toLocaleLowerCase())),
    );

    return await this.prisma.post.create({
      data: {
        authorId: userId,
        title: dto.title?.trim() || content.slice(0, 80),
        content,
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
        author: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
        comments: true,
        _count: { select: { likes: true } },
      },
    });
  }

  async editPostById(userId: number, postId: number, dto: EditPostDto) {
    const matches = (dto.content ?? '').matchAll(hashtagRegex);
    const tagNames = Array.from(
      new Set(Array.from(matches, (m) => m[1].toLocaleLowerCase())),
    );
    try {
      return await this.prisma.post.update({
        where: {
          id_authorId: {
            id: postId,
            authorId: userId,
          },
        },
        data: {
          authorId: userId,
          title: dto.title?.trim(),
          content: dto.content?.trim(),
          thumbnail: dto.thumbnail,
          tags: {
            ...(dto.content === undefined
              ? {}
              : {
                  set: [],
                  connectOrCreate: tagNames.map((name) => ({
                    where: { name },
                    create: { name },
                  })),
                }),
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
