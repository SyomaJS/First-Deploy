import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { IsNotEmpty, IsString } from 'class-validator';
import { Worker } from '../../worker/schemas/worker.schema';

export type SpecialityDocument = HydratedDocument<Speciality>;

@Schema({ versionKey: false })
export class Speciality {
  @IsString()
  @IsNotEmpty()
  @Prop({ required: true })
  speciality: string;

  @IsString()
  @IsNotEmpty()
  @Prop()
  description: string;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Worker' }])
  worker: Worker[];
}

export const SpecialitySchema = SchemaFactory.createForClass(Speciality);
