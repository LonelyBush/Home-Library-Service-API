import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CollectionTypes } from 'src/innerDb/innerDb';
import { Track } from 'src/interfaces/interfaces';
import { initDb } from 'src/main';
import { CreateTrackDto, UpdateTrackDto } from 'src/shemas/track.dto';
import { isValidUUID } from 'src/utils/validateUUID';

@Injectable()
export class TrackService {
  getTracks(): CollectionTypes[] {
    return initDb.getAll('Tracks');
  }
  getById(id: string) {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Bad ID', {
        description: 'Wrong id type, check request url and try again',
      });
    } else {
      return initDb.findById('Tracks', id, () => {
        //error callback
        throw new NotFoundException('Not found', {
          description: 'Track is not found, try again',
        });
      });
    }
  }
  createPost(createTrackDto: CreateTrackDto) {
    const { name, duration, artistId, albumId } = createTrackDto;
    const createId = randomUUID();
    if (!name || !duration) {
      throw new BadRequestException('Required field is missing', {
        description: 'Check your body request, and try again',
      });
    } else {
      return initDb.insert<Track>(
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

  updateTrack(updateTrackDto: UpdateTrackDto, id: string) {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Bad ID', {
        description: 'Wrong id type, check request url and try again',
      });
    }

    return initDb.update(
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

  delete(id: string) {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Bad ID', {
        description: 'Wrong id type, check request url and try again',
      });
    }
    const findTrack = initDb.findById('Tracks', id, () => {
      throw new NotFoundException('Not found', {
        description: 'Track is not found, try again',
      });
    }) as Track;
    if (findTrack) {
      initDb.delete('Tracks', findTrack.id);
      return `Track: ${findTrack.name} is succesfully deleted.`;
    }
  }
}
