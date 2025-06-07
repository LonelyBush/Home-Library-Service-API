import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsNotEmpty({ message: 'old password is required field !' })
  oldPassword: string;
  @IsNotEmpty({ message: 'new password is required field !' })
  newPassword: string;
}
