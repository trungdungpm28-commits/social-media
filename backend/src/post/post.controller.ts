import {
  Controller,
  Get,
  Post,
  UseGuards,
  Patch,
  HttpStatus,
  Param,
  ParseIntPipe,
  Body,
  HttpCode,
  Delete,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { PostService } from './post.service';
import { GetUser } from '../auth/decorator';
import { CreatePostDto, EditPostDto } from './dto';

@UseGuards(JwtGuard)
@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}

  @Get()
  getAllPosts(@GetUser('id') userId: number) {
    return this.postService.getAllPosts(userId);
  }

  @Get(':id')
  getPostById(@Param('id', ParseIntPipe) postId: number) {
    return this.postService.getPostById(postId);
  }

  @Post()
  createPost(@GetUser('id') userId: number, @Body() dto: CreatePostDto) {
    return this.postService.createPost(userId, dto);
  }

  @Patch(':id')
  editPostById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) postId: number,
    @Body() dto: EditPostDto,
  ) {
    return this.postService.editPostById(userId, postId, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deletePostById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) postId: number,
  ) {
    return this.postService.deletePostById(userId, postId);
  }
}
