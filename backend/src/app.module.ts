import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { CommentModule } from './comment/comment.module';
import { LikeModule } from './like/like.module';
import { PostModule } from './post/post.module';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    PrismaModule,
    CommentModule,
    LikeModule,
    PostModule,
    UserModule,
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class AppModule {} 