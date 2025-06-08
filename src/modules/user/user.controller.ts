import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  HttpCode,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import { idParam } from 'src/common-dto/idParam.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
  @Get()
  findAll() {
    return this.userService.findAll();
  }
  @Get(':id')
  findOne(@Param() params: idParam) {
    return this.userService.findOne(params);
  }

  @Put(':id')
  update(@Param() params: idParam, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(params, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param() params: idParam) {
    return this.userService.remove(params);
  }
}
