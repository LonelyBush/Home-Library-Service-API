import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CollectionTypes, InMemoryMapDB } from 'src/innerDb/innerDb';
import { isValidUUID } from 'src/utils/validateUUID';
import { randomUUID } from 'crypto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(@Inject('DATABASE') private readonly db: InMemoryMapDB) {}
  create(createUserDto: CreateUserDto) {
    const { login, password } = createUserDto;
    const createId = randomUUID();
    if (!login || !password) {
      throw new BadRequestException('Required field is ', {
        description: 'Wrong id type, check request url and try again',
      });
    } else {
      const isoData = new Date().toISOString();
      return this.db.insert<User>(
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

  findAll(): CollectionTypes[] {
    return this.db.getAll('Users');
  }

  findOne(id: string) {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Bad ID', {
        description: 'Wrong id type, check request url and try again',
      });
    } else {
      return this.db.findById('Users', id, () => {
        //error callback
        throw new NotFoundException('Not found', {
          description: 'User is not found, try again',
        });
      });
    }
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    const { newPassword, oldPassword } = updateUserDto;

    if (!isValidUUID(id)) {
      throw new BadRequestException('Bad ID', {
        description: 'Wrong id type, check request url and try again',
      });
    }

    const isoData = new Date().toISOString();
    return this.db.update(
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

  remove(id: string) {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Bad ID', {
        description: 'Wrong id type, check request url and try again',
      });
    }
    const findUser = this.db.findById('Users', id, () => {
      throw new NotFoundException('Not found', {
        description: 'User is not found, try again',
      });
    }) as User;
    if (findUser) {
      this.db.delete('Users', findUser.id);
      return `User: ${findUser.login} is succesfully deleted.`;
    }
  }
}
