import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CollectionTypes } from 'src/innerDb/innerDb';
import { CreateUserDto, UpdatePasswordDto } from 'src/shemas/user.dto';
import { UserService } from 'src/services/users.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getAll(): CollectionTypes[] {
    return this.userService.getAll();
  }
  @Get(':id')
  getById(@Param('id') id: string): CollectionTypes {
    return this.userService.getById(id);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.createPost(createUserDto);
  }

  @Put(':id')
  update(
    @Body() updateUserPasswordDto: UpdatePasswordDto,
    @Param('id') id: string,
  ) {
    return this.userService.updatePassword(updateUserPasswordDto, id);
  }

  @Delete(':id')
  @HttpCode(204)
  delete(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}
