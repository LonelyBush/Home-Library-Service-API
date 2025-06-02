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

    if (!login || !password) {
      throw new BadRequestException(
        'Missing required fields: login and password',
      );
    }

    const createId = randomUUID();
    const isoDate = new Date();

    const createdUser = this.db.insert<User>(
      'Users',
      {
        login,
        password,
        createdAt: isoDate.getTime(),
        updatedAt: isoDate.getTime(),
        id: createId,
        version: 1,
      },
      createId,
    ) as User;

    const { ...safeUser } = createdUser;
    delete safeUser.password;
    return safeUser;
  }

  findAll(): CollectionTypes[] {
    return this.db.getAll('Users').map((user: User) => {
      const { ...safeUser } = user;
      delete safeUser.password;
      return safeUser;
    });
  }

  findOne(id: string) {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Bad ID', {
        description: 'Wrong id type, check request url and try again',
      });
    }
    const findUser = this.db.findById('Users', id, () => {
      //error callback
      throw new NotFoundException('Not found', {
        description: 'User is not found, try again',
      });
    }) as User;
    const { ...safeUser } = findUser;
    delete safeUser.password;
    return safeUser;
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    const { newPassword, oldPassword } = updateUserDto;

    if (!isValidUUID(id) || Object.keys(updateUserDto).length <= 1) {
      throw new BadRequestException('Bad ID', {
        description: 'Wrong id type request, check request url and try again',
      });
    }
    if (!newPassword || !oldPassword) {
      throw new BadRequestException('Bad Body', {
        description: 'Wrong body request, check request body and try again',
      });
    }

    const isoDate = new Date();
    const updateUser = this.db.update(
      'Users',
      id,
      (oldData) => {
        const data = oldData as User;
        if (data.password === oldPassword) {
          return {
            ...oldData,
            password: newPassword,
            version: data.version + 1,
            updatedAt: isoDate.getTime(),
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
    ) as User;
    const { ...safeUser } = updateUser;
    delete safeUser.password;
    return safeUser;
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
      return;
    }
  }
}
