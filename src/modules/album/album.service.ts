import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { InMemoryMapDB } from 'src/innerDb/innerDb';
import { randomUUID } from 'crypto';
import { Album } from './entities/album.entity';
import { isValidUUID } from 'src/utils/validateUUID';
import { Artist } from '../artist/entities/artist.entity';
import { Track } from '../track/entities/track.entity';

@Injectable()
export class AlbumService {
  constructor(@Inject('DATABASE') private readonly db: InMemoryMapDB) {}
  create(createAlbumDto: CreateAlbumDto) {
    const { name, artistId, year } = createAlbumDto;
    const createId = randomUUID();
    if (!name || !year) {
      throw new BadRequestException('Required field is missing', {
        description: 'Check your body request, and try again',
      });
    } else {
      return this.db.insert<Album>(
        'Albums',
        {
          name,
          year,
          artistId: artistId ?? null,
          id: createId,
        },
        createId,
      );
    }
  }

  findAll() {
    return this.db.getAll('Albums');
  }

  findOne(id: string) {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Bad ID', {
        description: 'Wrong id type, check request url and try again',
      });
    } else {
      return this.db.findById('Albums', id, () => {
        //error callback
        throw new NotFoundException('Not found', {
          description: 'Album is not found, try again',
        });
      });
    }
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto) {
    const { name, artistId, year } = updateAlbumDto;
    console.log(isValidUUID('0a35dd62-e09f-444b-a628-f4e7c6954f57'));
    if (!isValidUUID(id)) {
      throw new BadRequestException('Bad ID', {
        description: 'Wrong id type, check request url and try again',
      });
    }
    if (typeof name !== 'string' || typeof year !== 'number') {
      throw new BadRequestException('Bad Body', {
        description: 'Wrong body request, check request body and try again',
      });
    }
    if (!name || !year) {
      throw new BadRequestException('Required field is missing', {
        description: 'Check your body request, and try again',
      });
    }

    const findArtist = this.db.findById('Artists', artistId, () => {
      console.log('Artist is not found. artistId will be set as null');
    }) as Artist;

    const updatedTrack = this.db.update(
      'Albums',
      id,
      (oldData) => {
        return {
          ...oldData,
          name,
          year,
          artistId: findArtist?.id ?? null,
        };
      },
      () => {
        throw new NotFoundException('Not found', {
          description: 'Album is not found, try again',
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
    const findAlbum = this.db.findById('Albums', id, () => {
      throw new NotFoundException('Not found', {
        description: 'Album is not found, try again',
      });
    }) as Album;
    if (findAlbum) {
      this.db.delete('Albums', findAlbum.id);
      const findTrack = this.db.find('Tracks', {
        albumId: findAlbum.id,
      })[0] as Track;

      if (findTrack)
        this.db.update(
          'Tracks',
          findTrack.id,
          (oldData) => {
            return {
              ...oldData,
              albumId: null,
            };
          },
          () => {},
        );
      return;
    }
  }
}
