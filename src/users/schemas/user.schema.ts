import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  numberPhone: string;

  @Prop({ required: true })
  confirmation: boolean;

  @Prop({ required: true })
  restriccion: string;
}

export const UserSchema = SchemaFactory.createForClass(User);