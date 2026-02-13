import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Journal, JournalDocument } from './schemas/journal.schema';
import { CreateJournalDto, UpdateJournalDto } from './dto';

@Injectable()
export class JournalsService {
  constructor(
    @InjectModel(Journal.name) private journalModel: Model<JournalDocument>,
  ) {}

  async create(
    userId: string,
    dto: CreateJournalDto,
  ): Promise<JournalDocument> {
    return this.journalModel.create({
      ...dto,
      userId: new Types.ObjectId(userId),
    });
  }

  async findAllByUser(
    userId: string,
    limit = 50,
  ): Promise<JournalDocument[]> {
    return this.journalModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }

  async findOne(userId: string, id: string): Promise<JournalDocument> {
    const journal = await this.journalModel.findById(id).exec();
    if (!journal) throw new NotFoundException('Journal not found');
    if (journal.userId.toString() !== userId) {
      throw new ForbiddenException();
    }
    return journal;
  }

  async update(
    userId: string,
    id: string,
    dto: UpdateJournalDto,
  ): Promise<JournalDocument> {
    const journal = await this.journalModel.findById(id).exec();
    if (!journal) throw new NotFoundException('Journal not found');
    if (journal.userId.toString() !== userId) {
      throw new ForbiddenException();
    }
    Object.assign(journal, dto);
    return journal.save();
  }

  async remove(userId: string, id: string): Promise<void> {
    const journal = await this.journalModel.findById(id).exec();
    if (!journal) throw new NotFoundException('Journal not found');
    if (journal.userId.toString() !== userId) {
      throw new ForbiddenException();
    }
    await journal.deleteOne();
  }

  async findPublicJournals(
    limit = 20,
    offset = 0,
  ): Promise<JournalDocument[]> {
    return this.journalModel
      .find({ isPublic: true })
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .populate('userId', 'username avatar')
      .exec();
  }

  toResponse(doc: JournalDocument) {
    const obj = doc.toObject();
    const response: Record<string, unknown> = {
      id: (obj._id as Types.ObjectId).toString(),
      date: obj.date,
      toolUsed: obj.toolUsed,
      duration: obj.duration,
      mood: obj.mood,
      focus: obj.focus,
      bodyTags: obj.bodyTags,
      mindTags: obj.mindTags,
      freeText: obj.freeText,
      isPublic: obj.isPublic,
      isAnonymous: obj.isAnonymous,
      likeCount: obj.likeCount,
      commentCount: obj.commentCount,
      createdAt: (obj as unknown as Record<string, unknown>).createdAt,
      updatedAt: (obj as unknown as Record<string, unknown>).updatedAt,
    };

    // Include user info if populated
    if (obj.userId && typeof obj.userId === 'object') {
      response.user = obj.userId;
    } else {
      response.userId = (obj.userId as Types.ObjectId).toString();
    }

    return response;
  }
}
