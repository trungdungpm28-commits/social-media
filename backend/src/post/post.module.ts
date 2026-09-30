import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { JwtStrategy } from '../auth/strategy';

@Module({
  controllers: [PostController],
  providers: [PostService, JwtStrategy]
})
export class PostModule {}
