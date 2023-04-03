import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateItemDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  details?: string;
}

export class UpdateItemDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  details?: string;
}
