import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { idParam } from 'src/modules/_dto/idParam.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly usersRep: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<User> {
    return this.usersRep.save({ ...createUserDto }).then((data) => {
      delete data.password;
      return { ...data };
    });
  }

  findAll(): Promise<User[]> {
    return this.usersRep.find({
      relations: {
        favorites: true,
      },
    });
  }

  async findOne(param: idParam): Promise<User | null> {
    const { id } = param;
    const getUser = await this.usersRep.findOne({
      where: { id },
      relations: { favorites: true },
    });
    if (!getUser) throw new NotFoundException('User not found');
    delete getUser.password;
    return getUser;
  }

  async update(
    param: idParam,
    updateUserDto: UpdateUserDto,
  ): Promise<Omit<User, 'password'>> {
    const { newPassword, oldPassword } = updateUserDto;
    const { id } = param;

    const user = await this.usersRep.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found');
    const updateUser = new User();
    if (oldPassword === user.password) {
      updateUser.password = newPassword;
      updateUser.id = id;
    } else {
      throw new ForbiddenException('Password: old password is wrong');
    }
    await this.usersRep.save({ ...updateUser });
    const getupdatedUser = await this.usersRep.findOneBy({ id });
    delete getupdatedUser.password;
    return getupdatedUser;
  }

  async remove(param: idParam): Promise<void> {
    const { id } = param;
    const getUser = await this.usersRep.findOneBy({ id });
    if (!getUser) throw new NotFoundException('User not found');
    await this.usersRep.delete(id);
  }
}
