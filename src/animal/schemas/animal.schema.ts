import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { AnimalType } from '../../animal_type/schemas/animal_type.schema';
import { Info } from '../../info/schemas/info.schema';

export type AnimalDocument = Animal & Document;

@Schema({ versionKey: false })
export class Animal {
  @Prop({ type: Types.ObjectId, ref: AnimalType.name })
  animal_type_id: AnimalType;

  @Prop()
  unique_id: string;

  @Prop({ type: Types.ObjectId, ref: 'Info' })
  info: Info;
}

export const AnimalSchema = SchemaFactory.createForClass(Animal);
