import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBlockDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
