import { Injectable } from '@nestjs/common';
import { Markup, Telegraf } from 'telegraf';
import { InjectBot } from 'nestjs-telegraf';
import { InjectModel } from '@nestjs/mongoose';
import { Bot, BotDocumet } from './schemas/bot.schema';
import { Model } from 'mongoose';
import { Context } from './contex.interface';

@Injectable()
export class BotService {
  constructor(
    @InjectModel(Bot.name) private readonly botModel: Model<BotDocumet>,
    @InjectBot('Farm-Otp-Sender') private readonly bot: Telegraf<Context>,
  ) {}

  async onStart(ctx: Context) {
    ctx.session = { type: 'start' };

    await ctx.reply('Choose your role:', {
      reply_markup: {
        keyboard: [['Login as Admin 👑', 'Login as Worker 👷']],
        resize_keyboard: true,
      },
    });
  }

  async createOnDB(ctx: Context, is_admin: boolean) {
    const user_id = ctx.from.id;
    const user = await this.botModel.findOne({ user_id: user_id });
    if (!user) {
      await this.botModel.create({
        user_id: user_id,
        last_name: ctx.from.last_name,
        first_name: ctx.from.first_name,
        username: ctx.from.username,
        is_admin: is_admin,
      });
      await ctx.reply(`Please, tap the button <b> "Send phone number" </b>⬇️`, {
        parse_mode: 'HTML',
        ...Markup.keyboard([
          [Markup.button.contactRequest('Send phone number 📞')],
        ])
          .oneTime()
          .resize(),
      });
    } else if (!user.status) {
      await ctx.reply(`Please, tap the button <b> "Send phone number" </b>⬇️`, {
        parse_mode: 'HTML',
        ...Markup.keyboard([
          [Markup.button.contactRequest('Send phone number 📞')],
        ])
          .oneTime()
          .resize(),
      });
    } else {
      await this.bot.telegram.sendChatAction(user_id, 'typing');
      await ctx.reply(
        'This bot created for logging into the farmer service 🐮🤠\nAnd alse you are already registered 😇',
        {
          parse_mode: 'HTML',
          ...Markup.removeKeyboard(),
        },
      );
    }
  }

  async onContact(ctx: Context) {
    ctx.session = { type: 'contact' };
    if ('contact' in ctx.message) {
      const user_id = ctx.from.id;
      console.log(ctx.from);

      console.log('User id: ', user_id);

      const user = await this.botModel.findOne({ user_id: user_id });

      if (!user) {
        ctx.reply(`Please tap <b> "Start" </b> button !⬇️`, {
          parse_mode: 'HTML',
          ...Markup.keyboard([['/start']])
            .oneTime()
            .resize(), //866537387
        });
      } else if (ctx.message.contact.user_id != user_id) {
        await ctx.reply(`Please send you own phone number! ☎️`, {
          parse_mode: 'HTML',
          ...Markup.keyboard([
            [Markup.button.contactRequest('Send Phone Number 📞')],
          ])
            .oneTime()
            .resize(),
        });
      } else {
        let phone: string;
        ctx.message.contact.phone_number[0] == '+'
          ? (phone = ctx.message.contact.phone_number)
          : (phone = '+' + ctx.message.contact.phone_number);
        await this.botModel.findOneAndUpdate(
          { user_id: user_id },
          {
            phone_number: phone,
            status: true,
          },
          { new: true },
        );
        await ctx.reply(`Congratulations you registered !🤩`, {
          parse_mode: 'HTML',
          ...Markup.removeKeyboard(),
        });
      }
    }
  }

  async onStop(ctx: Context) {
    const userId = ctx.from.id;
    const user = await this.botModel.findOne({ user_id: userId });

    if (user.status) {
      await this.botModel.findOneAndDelete(
        { user_id: userId },
        {
          status: false,
          phone_number: null,
        },
      );
    }

    await ctx.reply(`You loogged out from BOT 🙁`, {
      parse_mode: 'HTML',
      ...Markup.keyboard([['/start']])
        .oneTime()
        .resize(),
    });
  }

  async sendOTP(phoneNumber: string, OTP: string): Promise<boolean> {
    const user = await this.botModel.findOne({ phone_number: phoneNumber });

    if (!user || !user.status) {
      return false;
    }
    await this.bot.telegram.sendChatAction(user.user_id, 'typing');
    await this.bot.telegram.sendMessage(user.user_id, 'Verify code: ' + OTP);
    return true;
  }

  async onVerify(ctx: Context) {
    ctx.session = { type: 'verify' };
    await ctx.reply(
      'Please enter code for admins in order to verify that you are admin 😇✅',
    );
  }

  async capturePassword(ctx: Context) {
    const message = ctx.message['text'];

    if (message === 'Login as Admin 👑') {
      return this.onVerify(ctx);
    } else if (message === 'Login as Worker 👷') {
      return this.createOnDB(ctx, false);
    }

    if (ctx.session.type === 'verify') {
      const admin_pass = process.env.ADMIN_PASSWORD;
      const message_user = ctx.update['message']['text'];
      if (admin_pass === message_user) {
        return this.createOnDB(ctx, true);
      } else {
        await ctx.reply("Sorry ☹️, it's not a valid admin password");
        await ctx.reply('Try again 😇');
      }
    } else {
      await ctx.reply('This bot for register to our farmer company');
    }
  }
}
