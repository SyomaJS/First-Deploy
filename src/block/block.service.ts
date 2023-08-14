import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBlockDto } from './dto/create-block.dto';
import { UpdateBlockDto } from './dto/update-block.dto';
import { Block, BlockDocument } from './schemas/block.schema';

@Injectable()
export class BlockService {
  constructor(
    @InjectModel(Block.name) private blockModel: Model<BlockDocument>,
  ) {}

  async create(createBlockDto: CreateBlockDto): Promise<Block> {
    const createdBlock = new this.blockModel(createBlockDto);
    return createdBlock.save();
  }

  async findAll(): Promise<Block[]> {
    return this.blockModel.find().populate({
      path: 'workers',
      select: '-blocks',
    });
  }

  async findOne(id: string): Promise<Block> {
    return (await this.blockModel.findById(id).exec()).populate('workers');
  }

  async update(id: string, updateBlockDto: UpdateBlockDto): Promise<Block> {
    return this.blockModel
      .findByIdAndUpdate(id, updateBlockDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Block> {
    return this.blockModel.findByIdAndRemove(id).exec();
  }
}
