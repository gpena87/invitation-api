import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Observable, from, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { EmailService } from '../email/email.service';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private emailService: EmailService,
  ) {}

  create(dto: CreateUserDto): Observable<{ code: number; message: string }> {
    return from(this.userModel.create(dto)).pipe(
      switchMap((user) => this.emailService.sendNotification(user)),
      map(() => {
        this.logger.log(`Usuario creado y email enviado`);
        return {
          code: 200,
          message: 'Usuario creado correctamente',
        };
      }),
      catchError((err) => {
        this.logger.error('Error enviando email', err);
        return of({
          code: 200,
          message: 'Usuario creado correctamente (email no enviado)',
        });
      }),
      catchError((error) => {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        throw new Error('Error al crear el usuario: ' + errorMessage);
      }),
    );
  }

  findAll(): Observable<UserDocument[]> {
    return from(this.userModel.find().exec());
  }

  findOne(id: string): Observable<UserDocument | null> {
    return from(this.userModel.findById(id).exec());
  }

  update(id: string, dto: UpdateUserDto): Observable<UserDocument | null> {
    return from(
      this.userModel.findByIdAndUpdate(id, dto, { new: true }).exec(),
    ).pipe(
      catchError((error) => {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        throw new Error('Error al actualizar el usuario: ' + errorMessage);
      }),
    );
  }

  remove(id: string): Observable<UserDocument | null> {
    return from(this.userModel.findByIdAndDelete(id).exec());
  }
}
