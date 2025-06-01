import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TrackModule } from './track/track.module';
import { InMemoryMapDB } from './innerDb/innerDb';

@Module({
  imports: [InMemoryMapDB, UserModule, TrackModule],
})
export class AppModule {}
