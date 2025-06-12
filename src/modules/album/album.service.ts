import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';
import { idParam } from 'src/modules/_dto/idParam.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AlbumService {
  constructor(
    @InjectRepository(Album) private readonly albumDb: Repository<Album>,
  ) {}
  create(createAlbumDto: CreateAlbumDto) {
    return this.albumDb.save({ ...createAlbumDto });
  }

  findAll() {
    return this.albumDb.find();
  }

  async findOne(param: idParam) {
    const { id } = param;
    const getAlbum = await this.albumDb.findOneBy({ id });
    if (!getAlbum) throw new NotFoundException('Album not found');

    return getAlbum;
  }

  async update(param: idParam, updateAlbumDto: UpdateAlbumDto) {
    const { name, artistId, year } = updateAlbumDto;
    const { id } = param;
    const getAlbum = await this.albumDb.findOneBy({ id });
    if (!getAlbum) throw new NotFoundException('Album not found');
    const updateAlbum = new Album();
    updateAlbum.name = name ?? getAlbum.name;
    updateAlbum.year = year ?? getAlbum.year;
    updateAlbum.artistId = artistId ?? getAlbum.artistId;
    updateAlbum.id = id;
    return this.albumDb.save({ ...updateAlbum });
  }

  async remove(param: idParam) {
    const { id } = param;
    const getAlbum = await this.albumDb.findOneBy({ id });
    if (!getAlbum) throw new NotFoundException('Album not found');
    await this.albumDb.delete(id);
  }
}
