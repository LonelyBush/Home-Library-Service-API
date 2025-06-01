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
    if (!isValidUUID(id)) {
      throw new BadRequestException('Bad ID', {
        description: 'Wrong id type, check request url and try again',
      });
    }

    return this.db.update(
      'Tracks',
      id,
      (oldData) => {
        return {
          ...oldData,
          ...updateTrackDto,
        };
      },
      () => {
        throw new NotFoundException('Not found', {
          description: 'Track is not found, try again',
        });
      },
    );
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
      return `Track: ${findTrack.name} is succesfully deleted.`;
    }
  }
}
