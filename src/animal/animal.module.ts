import { MongooseModule } from '@nestjs/mongoose';
import { AnimalController } from './animal.controller';
import { AnimalService } from './animal.service';
import { Animal, AnimalSchema } from './schemas/animal.schema';
import { Module } from '@nestjs/common';

import {
  AnimalType,
  AnimalTypeSchema,
} from '../animal_type/schemas/animal_type.schema';
import { Info, InfoSchema } from '../info/schemas/info.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Animal.name, schema: AnimalSchema }]),
    MongooseModule.forFeature([
      { name: AnimalType.name, schema: AnimalTypeSchema },
    ]),
    MongooseModule.forFeature([{ name: Info.name, schema: InfoSchema }]),
  ],
  controllers: [AnimalController],
  providers: [AnimalService],
})
export class AnimalModule {}
