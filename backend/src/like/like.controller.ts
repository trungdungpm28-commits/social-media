import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { LikeService } from './like.service';
import { GetUser } from '../auth/decorator';

@UseGuards(JwtGuard)
@Controller('like')
export class LikeController {
  constructor(private likeservice: LikeService) {}

  @Post(':postid')
  createLike(
    @GetUser('id') userId: number,
    @Param('postid', ParseIntPipe) postId: number,
  ) {
    return this.likeservice.createLike(userId, postId);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':postid')
  deleteLike(
    @GetUser('id') userId: number,
    @Param('postid', ParseIntPipe) postId: number,
  ) {
    return this.likeservice.deleteLike(userId, postId);
  }
}
