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
      return initDb.findById('Users', id, () => {
        //error callback
        throw new NotFoundException('Not found', {
          description: 'User is not found, try again',
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

    const isoData = new Date().toISOString();
    return initDb.update(
      'Users',
      id,
      (oldData) => {
        const data = oldData as User;
        if (data.password === oldPassword) {
          return {
            ...oldData,
            password: newPassword,
            version: data.version + 1,
            updatedAt: isoData,
          };
        } else {
          throw new ForbiddenException('Wrong password', {
            description: 'Old password is wrong !',
          });
        }
      },
      () => {
        throw new NotFoundException('Not found', {
          description: 'User is not found, try again',
        });
      },
    );
  }

  delete(id: string) {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Bad ID', {
        description: 'Wrong id type, check request url and try again',
      });
    }
    const findUser = initDb.findById('Users', id, () => {
      throw new NotFoundException('Not found', {
        description: 'User is not found, try again',
      });
    }) as User;
    if (findUser) {
      initDb.delete('Users', findUser.id);
      return `User: ${findUser.login} is succesfully deleted.`;
    }
  }
}
