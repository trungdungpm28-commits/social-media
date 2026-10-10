import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto, EditCommentDto } from './dto ';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  getCommentByPostId(postId: number) {
    return this.prisma.comment.findMany({
      where: { postId },
      orderBy: { createdAt: 'asc' },
      include: {
        author: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
      },
    });
  }

  async createComment(userId: number, postId: number, dto: CreateCommentDto) {
    const content = dto.content.trim();
    if (!content) {
      throw new BadRequestException('Comment content cannot be empty');
    }
    const postExists = await this.prisma.post.findUnique({
      where: { id: postId },
      select: { id: true },
    });
    if (!postExists) {
      throw new NotFoundException('Post not found');
    }

    return this.prisma.comment.create({
      data: { authorId: userId, postId, content },
      include: {
        author: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
      },
    });
  }

  async editCommentById(userId: number, commentId: number, dto: EditCommentDto) {
    try {
      return await this.prisma.comment.update({
        where: {
          id_authorId: {
            id: commentId,
            authorId: userId,
          },
        },
        data: { content: dto.content },
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

  async deleteCommentById(userId: number, commentId: number) {
    try {
      await this.prisma.comment.delete({
        where: {
          id_authorId: {
            id: commentId,
            authorId: userId,
          },
        },
      });
    } catch (error) {
      if(error instanceof PrismaClientKnownRequestError && error.code ==='P2025'){
        throw new ForbiddenException('Access to resources denied');
      }
      throw error;
    }
  }
}
