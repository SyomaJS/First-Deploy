import { Module } from '@nestjs/common';
import { OptSchema, Otp } from './schemas/otp.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{ name: Otp.name, schema: OptSchema }])],
  controllers: [],
  providers: [],
})
export class OtpModule {}
