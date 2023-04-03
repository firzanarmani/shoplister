import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateListDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}

export class UpdateListDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsOptional()
  name?: string;
}
