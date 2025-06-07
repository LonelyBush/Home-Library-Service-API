import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { TrackModule } from './modules/track/track.module';
import { DatabaseModule } from './database/database.module';
import { AlbumModule } from './modules/album/album.module';
import { ArtistModule } from './modules/artist/artist.module';
import { FavsModule } from './modules/favs/favs.module';

@Module({
  imports: [DatabaseModule, UserModule, ArtistModule],
})
export class AppModule {}
