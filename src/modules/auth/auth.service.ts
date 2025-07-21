import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { JwtPayload } from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { Favorites } from '../favs/entities/fav.entity';

const { JWT_SECRET_KEY, JWT_SECRET_REFRESH_KEY, CRYPT_SALT } = process.env;

@Injectable()
export class AuthService {
  private cryptoSaltRounds = +CRYPT_SALT;
  constructor(
    @InjectRepository(Favorites)
    private readonly favsRep: Repository<Favorites>,
    @InjectRepository(User) private readonly usersRep: Repository<User>,
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(username: string, password: string) {
    const getUser = await this.usersRep.findOneBy({ login: username });
    if (!getUser) throw new ForbiddenException('User not found');

    const isPasswordValid = await this.comparePasswords(
      password,
      getUser.password,
    );
    if (!isPasswordValid) {
      throw new ForbiddenException('Wrong password, try again');
    }
    const getTokens = await this.getTokens(getUser.id, getUser.login);

    return getTokens;
  }

  async signUp(username: string, password: string) {
    const getUser = await this.usersRep.findOneBy({ login: username });
    if (getUser)
      throw new ForbiddenException('Too bad ! Such user is already exists !');
    const hashedPassword = await this.hashPassword(password);
    const newUser = await this.userService.create({
      login: username,
      password: hashedPassword,
    });
    const favs = new Favorites();
    favs.artists = [];
    favs.albums = [];
    favs.tracks = [];
    favs.userId = newUser.id;
    await this.usersRep.save({ id: newUser.id, favorites: favs });
    return newUser;
  }

  async refreshTokens(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException();
    }
    try {
      const payload: JwtPayload = await this.jwtService.verifyAsync(
        refreshToken,
        {
          secret: JWT_SECRET_REFRESH_KEY,
        },
      );
      const newTokens = await this.getTokens(payload.userId, payload.login);

      return newTokens;
    } catch {
      throw new ForbiddenException('Too bad ! Refresh token is expired !');
    }
  }

  async getTokens(userId: string, username: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          userId,
          login: username,
        },
        {
          secret: JWT_SECRET_KEY,
          expiresIn: '1h',
        },
      ),
      this.jwtService.signAsync(
        {
          userId,
          login: username,
        },
        {
          secret: JWT_SECRET_REFRESH_KEY,
          expiresIn: '24h',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, this.cryptoSaltRounds);
  }

  async comparePasswords(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}
