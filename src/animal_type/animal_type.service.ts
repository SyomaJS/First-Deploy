import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateAnimalTypeDto } from './dto/create-animal_type.dto';
import { AnimalType, AnimalTypeDocument } from './schemas/animal_type.schema';
import { UpdateAnimalTypeDto } from './dto/update-animal_type.dto';

@Injectable()
export class AnimalTypeService {
  constructor(
    @InjectModel(AnimalType.name)
    private animalTypeModel: Model<AnimalTypeDocument>,
  ) {}

  async create(createAnimalTypeDto: CreateAnimalTypeDto) {
    const createdAnimalType = new this.animalTypeModel(createAnimalTypeDto);
    return createdAnimalType.save();
  }

  async findAll() {
    return this.animalTypeModel.find().exec();
  }

  async findOne(id: string) {
    return this.animalTypeModel.findById(id).exec();
  }

  async update(id: string, updateAnimalTypeDto: UpdateAnimalTypeDto) {
    return this.animalTypeModel
      .findByIdAndUpdate(id, updateAnimalTypeDto, { new: true })
      .exec();
  }

  async remove(id: string) {
    return this.animalTypeModel.findByIdAndDelete(id).exec();
  }
}
