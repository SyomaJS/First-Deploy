import { IsNotEmpty, IsNumber, IsArray, IsString } from 'class-validator';

export class CreateWorkerDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  age: number;

  @IsNotEmpty()
  @IsNumber()
  experience: number;

  @IsNotEmpty()
  speciality: string;

  @IsNotEmpty()
  phone_number: string;

  @IsNotEmpty()
  @IsArray()
  worker_schedule: string[];

  block_IDs: string[];
}
