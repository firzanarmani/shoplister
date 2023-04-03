import { IsNotEmpty, IsString } from "class-validator";

export class CreateListDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class UpdateListDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}
