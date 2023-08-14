import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Animal, AnimalDocument } from './schemas/animal.schema';
import { CreateAnimalDto } from './dto/create-animal.dto';
import { v4 as uuidv4 } from 'uuid';
import * as qrcode from 'qrcode';
import axios from 'axios';

import {
  AnimalType,
  AnimalTypeDocument,
} from '../animal_type/schemas/animal_type.schema';

@Injectable()
export class AnimalService {
  constructor(
    @InjectModel(Animal.name) private animalModel: Model<AnimalDocument>,
    @InjectModel(AnimalType.name)
    private animalTypeModel: Model<AnimalTypeDocument>,
  ) {}

  async create(createAnimalDto: CreateAnimalDto) {
    const animalType = await this.animalTypeModel.findOne({
      _id: createAnimalDto.animal_type_id,
    });

    if (!animalType) {
      throw new BadRequestException('Animal type not found');
    }

    const existingAnimal = await this.animalModel.findOne({
      animal_type_id: createAnimalDto.animal_type_id,
    });

    if (existingAnimal) {
      throw new BadRequestException('An animal of this type already exists');
    }

    const createdAnimal = new this.animalModel({
      ...createAnimalDto,
      unique_id: uuidv4(),
    });

    animalType.animals.push(createdAnimal);
    await Promise.all([animalType.save(), createdAnimal.save()]);

    return createdAnimal;
  }
  async findAll() {
    return this.animalModel
      .find()
      .populate({
        path: 'animal_type_id',
        select: '-animals',
      })
      .populate({
        path: 'info',
        populate: { path: 'block_id', select: '-workers' },
        select: '-animal_id',
      });
  }

  async findOne(id: string) {
    return this.animalModel.findById(id).exec();
  }

  async update(id: string, updateAnimalDto: CreateAnimalDto) {
    return this.animalModel
      .findByIdAndUpdate(id, updateAnimalDto, { new: true })
      .exec();
  }

  async remove(id: string) {
    return this.animalModel.findByIdAndDelete(id).exec();
  }
}
