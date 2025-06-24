import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';
import { idParam } from 'src/modules/_dto/idParam.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ArtistService {
  constructor(
    @InjectRepository(Artist) private readonly artistDb: Repository<Artist>,
  ) {}
  create(createArtistDto: CreateArtistDto): Promise<Artist> {
    return this.artistDb.save({ ...createArtistDto });
  }

  findAll(): Promise<Artist[]> {
    return this.artistDb.find();
  }

  async findOne(param: idParam) {
    const { id } = param;
    const getArtist = await this.artistDb.findOneBy({ id });
    if (!getArtist) throw new NotFoundException('Artist not found');

    return getArtist;
  }

  async update(param: idParam, updateArtistDto: UpdateArtistDto) {
    const { name, grammy } = updateArtistDto;
    const { id } = param;
    const getArtist = await this.artistDb.findOneBy({ id });
    if (!getArtist) throw new NotFoundException('Artist not found');
    const updateArtist = new Artist();
    updateArtist.name = name ?? getArtist.name;
    updateArtist.grammy = grammy ?? getArtist.grammy;
    updateArtist.id = id;
    return this.artistDb.save({ ...updateArtist });
  }

  async remove(param: idParam) {
    const { id } = param;
    const getArtist = await this.artistDb.findOneBy({ id });
    if (!getArtist) throw new NotFoundException('Artist not found');
    await this.artistDb.delete(id);
  }
}
