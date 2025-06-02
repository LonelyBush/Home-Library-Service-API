import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { randomUUID } from 'crypto';
import { isValidUUID } from 'src/utils/validateUUID';
import { Track } from './entities/track.entity';
import { InMemoryMapDB } from 'src/innerDb/innerDb';
import { Artist } from '../artist/entities/artist.entity';
import { Album } from '../album/entities/album.entity';
import { Favorites } from '../favs/entities/fav.entity';

@Injectable()
export class TrackService {
  constructor(@Inject('DATABASE') private readonly db: InMemoryMapDB) {}
  create(createTrackDto: CreateTrackDto) {
    const { name, duration, artistId, albumId } = createTrackDto;
    const createId = randomUUID();
    if (!name || !duration) {
      throw new BadRequestException('Required field is missing', {
        description: 'Check your body request, and try again',
      });
    } else {
      return this.db.insert<Track>(
        'Tracks',
        {
          name,
          duration,
          artistId: artistId ?? null,
          albumId: albumId ?? null,
          id: createId,
        },
        createId,
      );
    }
  }

  findAll() {
    return this.db.getAll('Tracks');
  }

  findOne(id: string) {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Bad ID', {
        description: 'Wrong id type, check request url and try again',
      });
    } else {
      return this.db.findById('Tracks', id, () => {
        //error callback
        throw new NotFoundException('Not found', {
          description: 'Track is not found, try again',
        });
      });
    }
  }

  update(id: string, updateTrackDto: UpdateTrackDto) {
    const { name, duration, albumId, artistId } = updateTrackDto;
    if (!isValidUUID(id)) {
      throw new BadRequestException('Bad ID', {
        description: 'Wrong id type, check request url and try again',
      });
    }
    if (typeof name !== 'string' || typeof duration !== 'number') {
      throw new BadRequestException('Bad Body', {
        description: 'Wrong body request, check request body and try again',
      });
    }
    if (!name || !duration) {
      throw new BadRequestException('Required field is missing', {
        description: 'Check your body request, and try again',
      });
    }
    const findArtist = this.db.findById('Artists', artistId, () => {
      console.log('Artist is not found. artistId will be set as null');
    }) as Artist;
    const findAlbum = this.db.findById('Albums', albumId, () => {
      console.log('Album is not found. albumId will be set as null');
    }) as Album;
    console.log(findAlbum, findAlbum);
    const updatedTrack = this.db.update(
      'Tracks',
      id,
      (oldData) => {
        return {
          ...oldData,
          name,
          duration,
          albumId: findAlbum?.id ?? null,
          artistId: findArtist?.id ?? null,
        };
      },
      () => {
        throw new NotFoundException('Not found', {
          description: 'Track is not found, try again',
        });
      },
    );
    return updatedTrack;
  }

  remove(id: string) {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Bad ID', {
        description: 'Wrong id type, check request url and try again',
      });
    }
    const findTrack = this.db.findById('Tracks', id, () => {
      throw new NotFoundException('Not found', {
        description: 'Track is not found, try again',
      });
    }) as Track;
    if (findTrack) {
      this.db.delete('Tracks', findTrack.id);
      const getFavs = this.db
        .getAll('Favorites')
        .map((el: Favorites & { id: string }) => ({
          tracks: el.tracks,
          id: el.id,
        }))[0];

      if (getFavs && getFavs.tracks.some((el) => el.id === findTrack.id)) {
        const updateFavTracks = getFavs.tracks.filter(
          (el) => el.id !== findTrack.id,
        );
        this.db.update(
          'Favorites',
          getFavs.id,
          (oldData) => {
            return {
              ...oldData,
              tracks: updateFavTracks,
            };
          },
          () => {
            throw new NotFoundException('Not found', {
              description: 'Favs is not found, try again',
            });
          },
        );
      }
      return;
    }
  }
}
