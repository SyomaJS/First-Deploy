import { BotService } from './bot.service';
import { Command, Ctx, On, Start, Update } from 'nestjs-telegraf';
import { Context } from './contex.interface';

@Update()
export class BotUpdate {
  constructor(private readonly botService: BotService) {}

  @Start()
  async onStart(@Ctx() ctx: Context) {
    return this.botService.onStart(ctx);
  }
  @On('contact')
  onContact(@Ctx() ctx: Context) {
    return this.botService.onContact(ctx);
  }

  @Command('stop')
  onStop(@Ctx() ctx: Context) {
    return this.botService.onStop(ctx);
  }

  @Command('verify')
  onVerify(@Ctx() ctx: Context) {
    return this.botService.onVerify(ctx);
  }

  @On('text')
  async onText(@Ctx() ctx: Context) {
    return this.botService.capturePassword(ctx);
  }
}
