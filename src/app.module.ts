import { Module } from '@nestjs/common';
import { UserController } from './controllers/users.controller';
import { UserService } from './services/users.service';
import { TrackService } from './services/track.service';
import { TrackController } from './controllers/track.controller';

@Module({
  imports: [],
  controllers: [UserController, TrackController],
  providers: [UserService, TrackService],
})
export class AppModule {}
