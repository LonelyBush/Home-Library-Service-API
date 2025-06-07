import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { idParam } from 'src/common-dto/idParam.dto';
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

  async findOne(param: idParam): Promise<User | null> {
    const { id } = param;
    const getUser = await this.usersRep.findOneBy({ id });
    if (!getUser) throw new NotFoundException('User not found');

    return getUser;
  }

  async update(param: idParam, updateUserDto: UpdateUserDto) {
    const { newPassword, oldPassword } = updateUserDto;
    const { id } = param;

    const user = await this.usersRep.findOneBy({ id });
    const updateUser = new User();
    if (oldPassword === user.password) {
      updateUser.password = newPassword;
      updateUser.id = id;
    } else {
      throw new ForbiddenException('Password: old password is wrong');
    }
    return this.usersRep.save({ ...user });
  }

  async remove(param: idParam): Promise<void> {
    const { id } = param;
    await this.usersRep.delete(id);
  }
}
