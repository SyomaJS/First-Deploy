import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsBoolean } from 'class-validator';

export type AdminDocument = HydratedDocument<Admin>;

@Schema({ versionKey: false })
export class Admin {
  @Prop({ required: true, trim: true })
  @IsNotEmpty({ message: 'Full name is required' })
  full_name: string;

  @Prop({ required: true, trim: true })
  @IsNotEmpty({ message: 'Phone number is required' })
  phone_number: string;

  @Prop({ required: true, trim: true })
  @IsNotEmpty({ message: 'Telegram link is required' })
  tg_link: string;

  @Prop({ trim: true, default: null })
  @IsNotEmpty({ message: 'Hashed token is required' })
  hashed_token: string;

  @Prop({ default: false })
  @IsBoolean()
  is_active: boolean;

  @Prop({ default: false })
  @IsBoolean()
  is_creator: boolean;

  @Prop()
  description: string;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
