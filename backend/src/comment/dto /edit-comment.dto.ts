import { Optional } from '@nestjs/common';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class EditCommentDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  content?: string;
}
