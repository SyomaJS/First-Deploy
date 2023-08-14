import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BotDocumet = HydratedDocument<Bot>;

@Schema({ versionKey: false })
export class Bot {
  @Prop({ required: true })
  user_id: number;

  @Prop()
  last_name: string;

  @Prop()
  first_name: string;

  @Prop()
  username: string;

  @Prop({ default: false })
  status: boolean;

  @Prop({ default: null })
  phone_number: string;

  @Prop({ default: false })
  is_admin: boolean;
}

export const BotSchema = SchemaFactory.createForClass(Bot);
