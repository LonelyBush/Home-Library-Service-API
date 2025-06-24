import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInUserDto } from './dto/auth-signIn.dto';
import { Public } from 'src/decoratos/isPublic.decorator';
import { SignUpUserDto } from './dto/auth-signup.dto';
import { RefreshTokenDTO } from './dto/auth-refresh.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('/login')
  signIn(@Body() signInDto: SignInUserDto) {
    return this.authService.signIn(signInDto.login, signInDto.password);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('/signup')
  signUp(@Body() signUpDto: SignUpUserDto) {
    return this.authService.signUp(signUpDto.login, signUpDto.password);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('/refresh')
  refreshToken(@Body() refreshDto: RefreshTokenDTO) {
    return this.authService.refreshTokens(refreshDto.refreshToken);
  }
}
