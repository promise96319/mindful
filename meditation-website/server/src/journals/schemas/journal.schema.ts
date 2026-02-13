import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type JournalDocument = HydratedDocument<Journal>;

@Schema({ timestamps: true })
export class Journal {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  date: string;

  @Prop({ default: '' })
  toolUsed: string;

  @Prop({ required: true })
  duration: number;

  @Prop({ required: true, min: 1, max: 5 })
  mood: number;

  @Prop({ required: true, min: 1, max: 5 })
  focus: number;

  @Prop({ type: [String], default: [] })
  bodyTags: string[];

  @Prop({ type: [String], default: [] })
  mindTags: string[];

  @Prop({ default: '' })
  freeText: string;

  @Prop({ default: false, index: true })
  isPublic: boolean;

  @Prop({ default: false })
  isAnonymous: boolean;

  @Prop({ default: 0 })
  likeCount: number;

  @Prop({ default: 0 })
  commentCount: number;
}

export const JournalSchema = SchemaFactory.createForClass(Journal);

// Compound index for public journals sorted by creation date
JournalSchema.index({ isPublic: 1, createdAt: -1 });

// Text search index for free text search
JournalSchema.index({ freeText: 'text' });
