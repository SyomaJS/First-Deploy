import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminModule } from './admin/admin.module';
import { JwtModule } from '@nestjs/jwt';
import { SpecialityModule } from './speciality/speciality.module';
import { WorkerModule } from './worker/worker.module';
import { BotModule } from './bot/bot.module';
import { TelegrafModule } from 'nestjs-telegraf';
import { OtpModule } from './otp/otp.module';
import { BlockModule } from './block/block.module';
import { AnimalTypeModule } from './animal_type/animal_type.module';
import { AnimalModule } from './animal/animal.module';
import { InfoModule } from './info/info.module';
import * as LocalSession from 'telegraf-session-local';

const sessions = new LocalSession({ database: 'session_db.json' });

@Module({
  imports: [
    TelegrafModule.forRootAsync({
      botName: process.env.BOT_NAME,
      useFactory: () => ({
        token: process.env.BOT_TOKEN,
        middlewares: [sessions.middleware()],
        include: [BotModule],
      }),
    }),

    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    AdminModule,
    JwtModule.register({}),
    SpecialityModule,
    WorkerModule,
    BotModule,
    OtpModule,
    BlockModule,
    AnimalTypeModule,
    AnimalModule,
    InfoModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
