import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { isValidUUID } from 'src/utils/validateUUID';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly usersRep: Repository<User>,
  ) {}
  create(createUserDto: CreateUserDto): Promise<User> {
    return this.usersRep.save({ ...createUserDto });
  }

  findAll(): Promise<User[]> {
    return this.usersRep.find();
  }

  findOne(id: string): Promise<User | null> {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Bad ID', {
        description: 'Wrong id type, check request url and try again',
      });
    }
    return this.usersRep.findOneBy({ id });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const { newPassword, oldPassword } = updateUserDto;

    if (!isValidUUID(id)) {
      throw new BadRequestException('Bad ID', {
        description: 'Wrong id type request, check request url and try again',
      });
    }
    const user = await this.usersRep.findOneBy({ id });
    const updateUser = new User();
    if (oldPassword === user.password) {
      updateUser.password = newPassword;
      updateUser.id = id;
    }
    return this.usersRep.save({ ...user });
  }

  async remove(id: string): Promise<void> {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Bad ID', {
        description: 'Wrong id type, check request url and try again',
      });
    }
    await this.usersRep.delete(id);
  }
}
