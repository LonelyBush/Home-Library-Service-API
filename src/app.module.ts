import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TrackModule } from './track/track.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [DatabaseModule, UserModule, TrackModule],
})
export class AppModule {}
