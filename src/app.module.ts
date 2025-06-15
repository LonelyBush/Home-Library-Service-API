import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { DatabaseModule } from './database/database.module';
import { AlbumModule } from './modules/album/album.module';
import { ArtistModule } from './modules/artist/artist.module';
import { TrackModule } from './modules/track/track.module';
import { FavsModule } from './modules/favs/favs.module';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { FileModule } from './modules/file/file.module';
import { LoggerModule } from './modules/logger/logger.module';

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    ArtistModule,
    AlbumModule,
    TrackModule,
    FavsModule,
    LoggerModule,
    FileModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
