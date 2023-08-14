import { Module } from '@nestjs/common';
import { WorkerService } from './worker.service';
import { WorkerController } from './worker.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Worker, WorkerSchema } from './schemas/worker.schema';
import { SpecialityModule } from '../speciality/speciality.module';
import {
  Speciality,
  SpecialitySchema,
} from '../speciality/schemas/speciality.schema';
import { Block, BlockSchema } from '../block/schemas/block.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Worker.name, schema: WorkerSchema }]),
    MongooseModule.forFeature([{ name: Block.name, schema: BlockSchema }]),
    MongooseModule.forFeature([
      { name: Speciality.name, schema: SpecialitySchema },
    ]),
    SpecialityModule,
  ],

  controllers: [WorkerController],
  providers: [WorkerService],
  exports: [WorkerService],
})
export class WorkerModule {}
