import { IsOptional, IsString, IsNumber, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetUserDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  limit?: number = 10;
}
