import 'dotenv/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/modules/user/entities/user.entity';
import { UserModule } from 'src/modules/user/user.module';
import { Artist } from 'src/modules/artist/entities/artist.entity';
import { ArtistModule } from 'src/modules/artist/artist.module';

const { POSTGRES_PASSWORD } = process.env;
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: POSTGRES_PASSWORD,
      database: 'home-library-service-api',
      entities: [User, Artist],
      synchronize: true,
    }),
    UserModule,
    ArtistModule,
  ],
})
export class DatabaseModule {}
