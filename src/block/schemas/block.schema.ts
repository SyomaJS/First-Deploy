import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty, IsString } from 'class-validator';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Worker } from '../../worker/schemas/worker.schema';

export type BlockDocument = HydratedDocument<Block>;
@Schema({ versionKey: false })
export class Block {
  @IsString()
  @IsNotEmpty()
  @Prop({ required: true })
  name: string;

  @IsString()
  @IsNotEmpty()
  @Prop()
  description: string;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Worker' }])
  workers: Worker[];
}

export const BlockSchema = SchemaFactory.createForClass(Block);
