import { type Item } from "@prisma/client";
import { IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class GetListsDto {
  @IsString()
  @IsNotEmpty()
  email: string;
}
export class GetListDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  id: string;
}

export class CreateListDto {
  @IsString()
  @IsNotEmpty()
  email: string;

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

  @IsArray()
  @IsOptional()
  items?: Item[];
}

export class DeleteListDto {
  @IsString()
  @IsNotEmpty()
  id: string;
}
