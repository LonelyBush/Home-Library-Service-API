import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CollectionTypes } from 'src/innerDb/innerDb';
import { User } from 'src/interfaces/interfaces';
import { initDb } from 'src/main';
import { CreateUserDto, UpdatePasswordDto } from 'src/shemas/user.dto';
import { isValidUUID } from 'src/utils/validateUUID';

@Injectable()
export class UserService {
  getAll(): CollectionTypes[] {
    return initDb.getAll('Users');
  }
  getById(id: string) {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Bad ID', {
        description: 'Wrong id type, check request url and try again',
      });
    } else {
      return initDb.findById('Users', id, (err) => {
        //error callback
        throw new NotFoundException('Not found', {
          description: err,
        });
      });
    }
  }
  createPost(createUserDto: CreateUserDto) {
    const { login, password } = createUserDto;
    const createId = randomUUID();
    if (!login || !password) {
      throw new BadRequestException('Required field is ', {
        description: 'Wrong id type, check request url and try again',
      });
    } else {
      const isoData = new Date().toISOString();
      return initDb.insert<User>(
        'Users',
        {
          login,
          password,
          createdAt: isoData,
          updatedAt: isoData,
          id: createId,
          version: 1,
        },
        createId,
      );
    }
  }

  updatePassword(updateUserPasswordDto: UpdatePasswordDto, id: string) {
    const { newPassword, oldPassword } = updateUserPasswordDto;

    if (!isValidUUID(id)) {
      throw new BadRequestException('Bad ID', {
        description: 'Wrong id type, check request url and try again',
      });
    }
    const findUser = initDb.findById('Users', id, (err) => {
      throw new NotFoundException('Not found', {
        description: err,
      });
    }) as User;

    const isValidPassword = oldPassword === findUser.password;

    if (isValidPassword) {
      initDb.update('Users', id, { ...findUser, password: newPassword });
    } else {
      throw new ForbiddenException('Wrong password', {
        description: 'Old password is wrong !',
      });
    }
  }

  delete(id: string) {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Bad ID', {
        description: 'Wrong id type, check request url and try again',
      });
    }
    const findUser = initDb.findById('Users', id, (err) => {
      throw new NotFoundException('Not found', {
        description: err,
      });
    }) as User;
    if (findUser) {
      initDb.delete('Users', findUser.id);
    }
  }
}
