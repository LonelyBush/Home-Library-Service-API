import { Module, OnModuleInit } from '@nestjs/common';
import { FavsService } from './favs.service';
import { FavsController } from './favs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favorites } from './entities/fav.entity';
import { Album } from '../album/entities/album.entity';
import { Track } from '../track/entities/track.entity';
import { Artist } from '../artist/entities/artist.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Favorites, Album, Track, Artist])],
  controllers: [FavsController],
  providers: [FavsService],
})
export class FavsModule implements OnModuleInit {
  constructor(private readonly favoritesService: FavsService) {}
  async onModuleInit(): Promise<void> {
    await this.favoritesService.initializeFavorites();
  }
}
