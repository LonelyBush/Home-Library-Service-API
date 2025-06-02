import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { InMemoryMapDB } from 'src/innerDb/innerDb';
import { randomUUID } from 'crypto';
import { Artist } from './entities/artist.entity';
import { isValidUUID } from 'src/utils/validateUUID';
import { Album } from '../album/entities/album.entity';
import { Track } from '../track/entities/track.entity';
import { Favorites } from '../favs/entities/fav.entity';

@Injectable()
export class ArtistService {
  constructor(@Inject('DATABASE') private readonly db: InMemoryMapDB) {}
  create(createArtistDto: CreateArtistDto) {
    const { name, grammy } = createArtistDto;
    const createId = randomUUID();
    if (!name || !grammy) {
      throw new BadRequestException('Required field is missing', {
        description: 'Check your body request, and try again',
      });
    } else {
      return this.db.insert<Artist>(
        'Artists',
        {
          name,
          grammy,
          id: createId,
        },
        createId,
      );
    }
  }

  findAll() {
    return this.db.getAll('Artists');
  }

  findOne(id: string) {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Bad ID', {
        description: 'Wrong id type, check request url and try again',
      });
    } else {
      return this.db.findById('Artists', id, () => {
        //error callback
        throw new NotFoundException('Not found', {
          description: 'Artist is not found, try again',
        });
      });
    }
  }

  update(id: string, updateArtistDto: UpdateArtistDto) {
    const { name, grammy } = updateArtistDto;
    if (!isValidUUID(id)) {
      throw new BadRequestException('Bad ID', {
        description: 'Wrong id type, check request url and try again',
      });
    }
    if (typeof name !== 'string' || typeof grammy !== 'boolean') {
      throw new BadRequestException('Bad Body', {
        description: 'Wrong body request, check request body and try again',
      });
    }
    const updatedArtists = this.db.update(
      'Artists',
      id,
      (oldData) => {
        return {
          ...oldData,
          name,
          grammy,
        };
      },
      () => {
        throw new NotFoundException('Not found', {
          description: 'Artist is not found, try again',
        });
      },
    );
    return updatedArtists;
  }

  remove(id: string) {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Bad ID', {
        description: 'Wrong id type, check request url and try again',
      });
    }
    const findArtist = this.db.findById('Artists', id, () => {
      throw new NotFoundException('Not found', {
        description: 'Artists is not found, try again',
      });
    }) as Artist;
    if (findArtist) {
      this.db.delete('Artists', findArtist.id);
      const findAlbum = this.db.find('Albums', {
        artistId: findArtist.id,
      })[0] as Album;
      const findTrack = this.db.find('Tracks', {
        artistId: findArtist.id,
      })[0] as Track;
      const getFavs = this.db
        .getAll('Favorites')
        .map((el: Favorites & { id: string }) => ({
          albums: el.albums,
          tracks: el.tracks,
          artists: el.artists,
          id: el.id,
        }))[0];

      if (getFavs && getFavs.artists.some((el) => el.id === findArtist.id)) {
        const updateFavArtists = getFavs.artists.filter(
          (el) => el.id !== findArtist.id,
        );
        this.db.update(
          'Favorites',
          getFavs.id,
          (oldData) => {
            return {
              ...oldData,
              artists: updateFavArtists,
            };
          },
          () => {
            throw new NotFoundException('Not found', {
              description: 'Favs is not found, try again',
            });
          },
        );
      }

      if (findAlbum) {
        this.db.update(
          'Albums',
          findAlbum.id,
          (oldData) => {
            return {
              ...oldData,
              artistId: null,
            };
          },
          () => {},
        );
        if (
          getFavs &&
          getFavs.albums.some((el) => el.artistId === findArtist.id)
        ) {
          const updateFavAlbums = getFavs.albums.map((el) => {
            if (findAlbum.id === el.id) {
              return { ...el, artistId: null };
            }
            return { ...el };
          });
          this.db.update(
            'Favorites',
            getFavs.id,
            (oldData) => {
              return {
                ...oldData,
                albums: updateFavAlbums,
              };
            },
            () => {
              throw new NotFoundException('Not found', {
                description: 'Favs is not found, try again',
              });
            },
          );
        }
      }

      if (findTrack) {
        this.db.update(
          'Tracks',
          findTrack.id,
          (oldData) => {
            return {
              ...oldData,
              artistId: null,
            };
          },
          () => {},
        );
        if (
          getFavs &&
          getFavs.tracks.some((el) => el.artistId === findArtist.id)
        ) {
          const updateFavTracks = getFavs.tracks.map((el) => {
            if (findTrack.id === el.id) {
              return { ...el, artistId: null };
            }
            return { ...el };
          });
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
      }

      return;
    }
  }
}
