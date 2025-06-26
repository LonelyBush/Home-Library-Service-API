import { Module } from '@nestjs/common';
import { FavsService } from './favs.service';
import { FavsController } from './favs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Album } from '../album/entities/album.entity';
import { Track } from '../track/entities/track.entity';
import { Artist } from '../artist/entities/artist.entity';
import { Favorites } from './entities/fav.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Album, Track, Artist, Favorites])],
  controllers: [FavsController],
  providers: [FavsService],
})
export class FavsModule {}
