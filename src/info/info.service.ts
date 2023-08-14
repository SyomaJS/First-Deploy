import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateInfoDto } from './dto/create-info.dto';
import { UpdateInfoDto } from './dto/update-info.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Info, InfoDocument } from './schemas/info.schema';
import { Model } from 'mongoose';
import { Animal, AnimalDocument } from '../animal/schemas/animal.schema';
import { Block, BlockDocument } from '../block/schemas/block.schema';

@Injectable()
export class InfoService {
  constructor(
    @InjectModel(Info.name) private infoModel: Model<InfoDocument>,
    @InjectModel(Animal.name) private animalModel: Model<AnimalDocument>,
    @InjectModel(Block.name) private blockModel: Model<BlockDocument>,
  ) {}

  async create(createInfoDto: CreateInfoDto) {
    const animal = await this.animalModel.findOne({
      _id: createInfoDto.animal_id,
    });
    const block = await this.blockModel.findOne({
      _id: createInfoDto.block_id,
    });

    if (!block || !animal)
      throw new BadRequestException(
        'Animal or block with this id is not found ',
      );

    const newInfo = await this.infoModel.create(createInfoDto);
    animal.info = newInfo;
    await animal.save();

    return newInfo;
  }

  async findAll() {
    const infoAnimals = await this.infoModel
      .find()
      .populate({
        path: 'block_id',
        select: '-workers',
      })
      .populate({
        path: 'animal_id',
      });

    return infoAnimals;
  }

  async findOne(id: number) {
    return `This action returns a #${id} info`;
  }

  async update(id: number, updateInfoDto: UpdateInfoDto) {
    return `This action updates a #${id} info`;
  }

  async remove(id: number) {
    return `This action removes a #${id} info`;
  }
}
