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
      'Artits',
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
      return;
    }
  }
}
