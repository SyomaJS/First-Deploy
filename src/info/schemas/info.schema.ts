import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';
import { Block } from '../../block/schemas/block.schema';
import { Animal } from '../../animal/schemas/animal.schema';

export type InfoDocument = HydratedDocument<Info>;

@Schema({ versionKey: false })
export class Info {
  @Prop({ required: true })
  weight: number;

  @Prop({ required: true })
  height: number;

  @Prop({ required: true })
  color: string;

  @Prop({ required: true })
  breed: string;

  @Prop({ required: true })
  gender: string;

  @Prop()
  birth_or_acquisition: Date;

  @Prop({ type: String, ref: Block.name, required: true })
  block_id: string;

  @Prop({ type: String, ref: 'Animal', required: true })
  animal_id: string;
}

export const InfoSchema = SchemaFactory.createForClass(Info);
