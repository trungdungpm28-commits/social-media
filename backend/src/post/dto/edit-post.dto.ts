import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class EditPostDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  content?: string;

  @IsString()
  @IsOptional()
  thumbnail?: string;
}
