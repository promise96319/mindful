import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop()
  displayName: string;

  @Prop({ unique: true, sparse: true })
  email: string;

  @Prop()
  photoURL: string;

  @Prop()
  passwordHash: string;

  @Prop()
  googleId: string;

  @Prop()
  githubId: string;

  @Prop({ default: 0 })
  totalPracticeSeconds: number;

  @Prop({
    type: Object,
    default: { theme: 'light', language: 'zh-CN' },
  })
  settings: {
    theme: string;
    language: string;
  };

  @Prop()
  refreshToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
