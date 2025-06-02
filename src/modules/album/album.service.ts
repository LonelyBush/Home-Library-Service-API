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
    if (!isValidUUID(id)) {
      throw new BadRequestException('Bad ID', {
        description: 'Wrong id type, check request url and try again',
      });
    }
    if (
      typeof name !== 'string' ||
      typeof artistId !== 'string' ||
      typeof year !== 'number'
    ) {
      throw new BadRequestException('Bad Body', {
        description: 'Wrong body request, check request body and try again',
      });
    }
    if (!name || !year) {
      throw new BadRequestException('Required field is missing', {
        description: 'Check your body request, and try again',
      });
    }

    const updatedTrack = this.db.update(
      'Albums',
      id,
      (oldData) => {
        return {
          ...oldData,
          name,
          year,
          artistId: artistId ?? null,
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
    const findTrack = this.db.findById('Albums', id, () => {
      throw new NotFoundException('Not found', {
        description: 'Album is not found, try again',
      });
    }) as Album;
    if (findTrack) {
      this.db.delete('Albums', findTrack.id);
      return;
    }
  }
}
