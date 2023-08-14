import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber } from 'class-validator';

export class PhoneUserDto {
  @ApiProperty({
    example: '1234t434324',
    description: 'User phone number',
  })
  @IsNotEmpty()
  //   @IsPhoneNumber()
  phone: string;
}
