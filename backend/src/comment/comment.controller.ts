import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { CommentService } from './comment.service';
import { GetUser } from '../auth/decorator';
import { CreateCommentDto, EditCommentDto } from './dto ';

@UseGuards(JwtGuard)
@Controller('comment')
export class CommentController {
  constructor(private commentservice: CommentService) {}

  @Get('post/:postId')
  getCommentByPostId(@Param('postId', ParseIntPipe) postId: number) {
    return this.commentservice.getCommentByPostId(postId);
  }

  @Post(':postid')
  createComment(
    @GetUser('id') userId: number,
    @Param('postid', ParseIntPipe) postId: number,
    @Body() dto: CreateCommentDto,
  ) {
    return this.commentservice.createComment(userId, postId, dto);
  }

  @Patch(':id')
  editCommentById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) commentId,
    @Body() dto: EditCommentDto,
  ) {
    return this.commentservice.editCommentById(userId, commentId, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteCommentById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) commentId: number,
  ) {
    return this.commentservice.deleteCommentById(userId, commentId);
  }
}
