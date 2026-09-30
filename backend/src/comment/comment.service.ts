import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto, EditCommentDto } from './dto ';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  getCommentByPostId(postId: number) {
    return this.prisma.comment.findMany({ where: { postId: postId } });
  }

  async createComment(userId: number, postId: number, dto: CreateCommentDto) {
    return await this.prisma.comment.create({
      data: {
        authorId: userId,
        postId: postId,
        content: dto.content,
      },
    });
  }

  editCommentById(userId: number, commentId: number, dto: EditCommentDto) {
    try {
      return this.prisma.comment.update({
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
