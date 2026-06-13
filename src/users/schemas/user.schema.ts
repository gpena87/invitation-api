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

  @Prop({ required: false })
  numberPhone: string;

  @Prop({ required: true })
  confirmation: boolean;

  @Prop({ required: false })
  restriccion: string;

  @Prop({ required: false })
  message: string;
}

export const UserSchema = SchemaFactory.createForClass(User);