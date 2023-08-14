import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UUID } from 'crypto';
import mongoose, { HydratedDocument } from 'mongoose';

export type OtpDocument = HydratedDocument<Otp>;

@Schema({ versionKey: false })
export class Otp {
  @Prop({ required: true })
  id: UUID;

  @Prop({ required: true })
  otp: string;

  @Prop()
  expiration_time: Date;

  @Prop({ default: false })
  verified: boolean;

  @Prop({ required: true })
  check: string;
}

export const OptSchema = SchemaFactory.createForClass(Otp);
