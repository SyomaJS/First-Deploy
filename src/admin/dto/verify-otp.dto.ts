import { IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class VerifyOtpDto {
  @IsNotEmpty()
  @IsString()
  check: string;

  @IsNotEmpty()
  @IsString()
  verification_key: string;
  @IsNotEmpty()
  otp: string;
}
