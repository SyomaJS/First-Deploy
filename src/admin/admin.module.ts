import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from './schemas/admin.schema';
import { JwtModule } from '@nestjs/jwt';
import { BotModule } from '../bot/bot.module';
import { OptSchema, Otp } from '../otp/schemas/otp.schema';
import { OtpModule } from '../otp/otp.module';
import { Bot, BotSchema } from '../bot/schemas/bot.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Admin.name, schema: AdminSchema },
      { name: Otp.name, schema: OptSchema },
      { name: Bot.name, schema: BotSchema },
    ]),
    JwtModule,
    BotModule,
    OtpModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
