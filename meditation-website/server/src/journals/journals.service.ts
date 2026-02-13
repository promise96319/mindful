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

  async getPublicJournals(
    page = 1,
    limit = 20,
    sort: 'latest' | 'popular' = 'latest',
    search?: string,
  ): Promise<{ journals: JournalDocument[]; total: number }> {
    const skip = (page - 1) * limit;
    const filter: Record<string, unknown> = { isPublic: true };

    // Add text search if search query provided
    if (search && search.trim()) {
      filter.$text = { $search: search.trim() };
    }

    // Determine sort order
    const sortOptions: Record<string, unknown> =
      sort === 'popular'
        ? { likeCount: -1, createdAt: -1 }
        : { createdAt: -1 };

    const [journals, total] = await Promise.all([
      this.journalModel
        .find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .populate('userId', 'displayName avatar photoURL')
        .exec(),
      this.journalModel.countDocuments(filter),
    ]);

    return { journals, total };
  }

  async getFollowingJournals(
    userId: string,
    followingIds: string[],
    page = 1,
    limit = 20,
  ): Promise<{ journals: JournalDocument[]; total: number }> {
    const skip = (page - 1) * limit;

    // Convert following IDs to ObjectIds
    const followingObjectIds = followingIds.map((id) => new Types.ObjectId(id));

    const filter = {
      userId: { $in: followingObjectIds },
      isPublic: true,
    };

    const [journals, total] = await Promise.all([
      this.journalModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('userId', 'displayName avatar photoURL')
        .exec(),
      this.journalModel.countDocuments(filter),
    ]);

    return { journals, total };
  }

  async updateVisibility(
    userId: string,
    journalId: string,
    updates: { isPublic?: boolean; isAnonymous?: boolean },
  ): Promise<JournalDocument> {
    const journal = await this.journalModel.findById(journalId).exec();
    if (!journal) throw new NotFoundException('Journal not found');
    if (journal.userId.toString() !== userId) {
      throw new ForbiddenException();
    }

    if (updates.isPublic !== undefined) {
      journal.isPublic = updates.isPublic;
    }
    if (updates.isAnonymous !== undefined) {
      journal.isAnonymous = updates.isAnonymous;
    }

    return journal.save();
  }

  toResponse(doc: JournalDocument) {
    const obj = doc.toObject();
    return {
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
      createdAt: (obj as unknown as Record<string, unknown>).createdAt,
      updatedAt: (obj as unknown as Record<string, unknown>).updatedAt,
    };
  }
}
