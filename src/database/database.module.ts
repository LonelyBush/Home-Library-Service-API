import 'dotenv/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/modules/user/entities/user.entity';
import { UserModule } from 'src/modules/user/user.module';

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
      entities: [User],
      synchronize: true,
    }),
    UserModule,
  ],
})
export class DatabaseModule {}
