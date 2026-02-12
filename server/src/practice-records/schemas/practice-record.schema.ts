import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type PracticeRecordDocument = HydratedDocument<PracticeRecord>;

@Schema({ timestamps: true })
export class PracticeRecord {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  date: string;

  @Prop({ required: true })
  tool: string;

  @Prop({ required: true })
  duration: number;
}

export const PracticeRecordSchema =
  SchemaFactory.createForClass(PracticeRecord);
