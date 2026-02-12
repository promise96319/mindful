import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type JournalDocument = HydratedDocument<Journal>;

@Schema({ timestamps: true })
export class Journal {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  date: string;

  @Prop({ required: true })
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

  @Prop({ default: false })
  isPublic: boolean;

  @Prop({ default: false })
  isAnonymous: boolean;
}

export const JournalSchema = SchemaFactory.createForClass(Journal);
