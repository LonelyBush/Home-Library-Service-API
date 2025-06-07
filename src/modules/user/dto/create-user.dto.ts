import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Login is required field !' })
  login: string;
  @IsNotEmpty({ message: 'Password is required field !' })
  password: string;
}
