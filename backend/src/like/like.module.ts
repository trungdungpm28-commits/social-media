import { Module } from '@nestjs/common';
import { LikeController } from './like.controller';
import { LikeService } from './like.service';
import { JwtStrategy } from '../auth/strategy';

@Module({
  controllers: [LikeController],
  providers: [LikeService, JwtStrategy]
})
export class LikeModule {}
