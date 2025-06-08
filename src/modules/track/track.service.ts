import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';
import { idParam } from 'src/common-dto/idParam.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TrackService {
  constructor(
    @InjectRepository(Track) private readonly trackDb: Repository<Track>,
  ) {}
  create(createTrackDto: CreateTrackDto) {
    return this.trackDb.save({ ...createTrackDto });
  }

  findAll() {
    return this.trackDb.find();
  }

  async findOne(param: idParam) {
    const { id } = param;
    const getTrack = await this.trackDb.findOneBy({ id });
    if (!getTrack) throw new NotFoundException('Track not found');

    return getTrack;
  }

  async update(param: idParam, updateTrackDto: UpdateTrackDto) {
    const { name, duration, albumId, artistId } = updateTrackDto;
    const { id } = param;
    const getTrack = await this.trackDb.findOneBy({ id });
    const updateTrack = new Track();
    updateTrack.name = name ?? getTrack.name;
    updateTrack.duration = duration ?? getTrack.duration;
    updateTrack.artistId = artistId ?? getTrack.artistId;
    updateTrack.albumId = albumId ?? getTrack.albumId;
    updateTrack.id = id;
    return this.trackDb.save({ ...updateTrack });
  }

  async remove(param: idParam) {
    const { id } = param;
    await this.trackDb.delete(id);
  }
}
