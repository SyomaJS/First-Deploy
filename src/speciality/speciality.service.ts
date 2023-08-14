import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSpecialityDto } from './dto/create-speciality.dto';
import { UpdateSpecialityDto } from './dto/update-speciality.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Speciality } from './schemas/speciality.schema';
import { Model } from 'mongoose';

@Injectable()
export class SpecialityService {
  constructor(
    @InjectModel(Speciality.name) private specialityRepo: Model<Speciality>,
  ) {}

  async create(createSpecialityDto: CreateSpecialityDto) {
    const newSpec = await this.specialityRepo.create(createSpecialityDto);
    return newSpec;
  }

  async findAll() {
    const specialities = await this.specialityRepo.find().populate('worker');
    return specialities;
  }

  async findOne(id: string) {
    const speciality = (await this.specialityRepo.findById(id).exec()).populate(
      'worker',
    );
    if (!speciality) {
      throw new NotFoundException(`Speciality with id ${id} not found`);
    }
    return speciality;
  }

  async update(id: string, updateSpecialityDto: UpdateSpecialityDto) {
    const updatedSpeciality = await this.specialityRepo
      .findByIdAndUpdate(id, updateSpecialityDto, { new: true })
      .exec();

    if (!updatedSpeciality) {
      throw new NotFoundException(`Speciality with id ${id} not found`);
    }

    return updatedSpeciality;
  }

  async remove(id: string) {
    const deletedSpeciality = await this.specialityRepo
      .findByIdAndRemove(id)
      .exec();

    if (!deletedSpeciality) {
      throw new NotFoundException(`Speciality with id ${id} not found`);
    }

    return deletedSpeciality;
  }
}
