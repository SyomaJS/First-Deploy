import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEmail } from 'class-validator';
import mongoose, { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Speciality } from '../../speciality/schemas/speciality.schema';
import { Block } from '../../block/schemas/block.schema';

export type WorkerDocument = HydratedDocument<Worker>;

@Schema({ versionKey: false })
export class Worker {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  age: number;

  @Prop({ required: true })
  experience: number;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Speciality',
    required: true,
  })
  speciality: Speciality;

  @Prop({ required: true, unique: true })
  phone_number: string;

  @Prop({ required: true })
  worker_schedule: string[];

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: Block.name }])
  blocks: Block[];
}

export const WorkerSchema = SchemaFactory.createForClass(Worker);
