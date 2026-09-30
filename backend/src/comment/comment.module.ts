import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { JwtGuard } from '../auth/guard';
import { JwtStrategy } from '../auth/strategy';

@Module({
  controllers: [CommentController],
  providers: [CommentService, JwtStrategy]
})
export class CommentModule {}
