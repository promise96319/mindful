import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  PracticeRecord,
  PracticeRecordDocument,
} from './schemas/practice-record.schema';
import { CreatePracticeRecordDto } from './dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class PracticeRecordsService {
  constructor(
    @InjectModel(PracticeRecord.name)
    private recordModel: Model<PracticeRecordDocument>,
    private usersService: UsersService,
  ) {}

  async create(
    userId: string,
    dto: CreatePracticeRecordDto,
  ): Promise<PracticeRecordDocument> {
    const record = await this.recordModel.create({
      userId: new Types.ObjectId(userId),
      date: dto.date || new Date().toISOString().split('T')[0],
      tool: dto.tool,
      duration: dto.duration,
    });

    // Increment user's total practice seconds
    await this.usersService.incrementPracticeSeconds(userId, dto.duration);

    return record;
  }

  async findAllByUser(
    userId: string,
    startDate?: string,
    endDate?: string,
  ): Promise<PracticeRecordDocument[]> {
    const filter: Record<string, unknown> = {
      userId: new Types.ObjectId(userId),
    };
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) (filter.date as Record<string, string>).$gte = startDate;
      if (endDate) (filter.date as Record<string, string>).$lte = endDate;
    }
    return this.recordModel.find(filter).sort({ createdAt: -1 }).exec();
  }

  toResponse(doc: PracticeRecordDocument) {
    const obj = doc.toObject();
    return {
      id: (obj._id as Types.ObjectId).toString(),
      date: obj.date,
      tool: obj.tool,
      duration: obj.duration,
      createdAt: (obj as unknown as Record<string, unknown>).createdAt,
    };
  }
}
