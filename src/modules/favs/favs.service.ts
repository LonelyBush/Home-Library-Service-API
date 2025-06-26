import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Favorites } from './entities/fav.entity';
import { favsParams } from 'src/modules/_dto/idParam.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Track } from '../track/entities/track.entity';
import { Artist } from '../artist/entities/artist.entity';
import { Album } from '../album/entities/album.entity';

@Injectable()
export class FavsService {
  constructor(
    @InjectRepository(Favorites)
    private readonly favsRep: Repository<Favorites>,
    @InjectRepository(Album) private readonly albumDb: Repository<Album>,
    @InjectRepository(Track) private readonly trackDb: Repository<Track>,
    @InjectRepository(Artist) private readonly artistDb: Repository<Artist>,
  ) {}

  async findAll(userId: string) {
    const getFavs = await this.favsRep.findOneBy({ userId });

    const [artists, albums, tracks] = await Promise.all([
      this.artistDb.findBy({ id: In(getFavs.artists) }),
      this.albumDb.findBy({ id: In(getFavs.albums) }),
      this.trackDb.findBy({ id: In(getFavs.tracks) }),
    ]);

    return { artists, albums, tracks };
  }
  async addTrack(param: favsParams) {
    const { id, userId } = param;
    const getTrack = await this.trackDb.findOneBy({ id });
    const getFavs = await this.favsRep.findOneBy({ userId });

    if (!getTrack)
      throw new UnprocessableEntityException('Track id doesnt exists');

    const isAlreadeInFavs = getFavs.tracks.some((el) => el === id);

    return isAlreadeInFavs
      ? this.favsRep.save({ ...getFavs, tracks: [...getFavs.tracks] })
      : this.favsRep.save({
          ...getFavs,
          tracks: [...getFavs.tracks, id],
        });
  }
  async addAlbum(param: favsParams) {
    const { id, userId } = param;
    const getAlbum = await this.albumDb.findOneBy({ id });
    const getFavs = await this.favsRep.findOneBy({ userId });

    if (!getAlbum)
      throw new UnprocessableEntityException('Album id doesnt exists');

    const isAlreadeInFavs = getFavs.albums.some((el) => el === id);

    return isAlreadeInFavs
      ? this.favsRep.save({ ...getFavs, albums: [...getFavs.albums] })
      : this.favsRep.save({
          ...getFavs,
          albums: [...getFavs.albums, id],
        });
  }
  async addArtist(param: favsParams) {
    const { id, userId } = param;
    const getArtist = await this.artistDb.findOneBy({ id });
    const getFavs = await this.favsRep.findOneBy({ userId });

    if (!getArtist)
      throw new UnprocessableEntityException('Artist id doesnt exists');

    const isAlreadeInFavs = getFavs.artists.some((el) => el === id);
    return isAlreadeInFavs
      ? this.favsRep.save({
          ...getFavs,
          artists: [...getFavs.artists],
        })
      : this.favsRep.save({
          ...getFavs,
          artists: [...getFavs.artists, id],
        });
  }

  async removeTrack(param: favsParams) {
    const { id, userId } = param;
    const getTrack = await this.trackDb.findOneBy({ id });
    const getFavs = await this.favsRep.findOneBy({ userId });

    if (!getTrack)
      throw new UnprocessableEntityException('Track id doesnt exists');

    const isAlreadeInFavs = getFavs.tracks.some((el) => el === id);

    if (!isAlreadeInFavs)
      throw new NotFoundException('Track is not found in favorites');

    const filteredTracks = isAlreadeInFavs
      ? getFavs.tracks.filter((el) => el !== id)
      : getFavs.tracks;

    await this.favsRep.save({ ...getFavs, tracks: [...filteredTracks] });

    return;
  }
  async removeAlbum(param: favsParams) {
    const { id, userId } = param;
    const getAlbum = await this.albumDb.findOneBy({ id });
    const getFavs = await this.favsRep.findOneBy({ userId });

    if (!getAlbum)
      throw new UnprocessableEntityException('Album id doesnt exists');
    const isAlreadeInFavs = getFavs.albums.some((el) => el === id);

    if (!isAlreadeInFavs)
      throw new NotFoundException('Album is not found in favorites');

    const filteredAlbum = isAlreadeInFavs
      ? getFavs.albums.filter((el) => el !== id)
      : getFavs.albums;

    await this.favsRep.save({ ...getFavs, albums: [...filteredAlbum] });
    return;
  }

  async removeArtist(param: favsParams) {
    const { id, userId } = param;
    const getArtist = await this.artistDb.findOneBy({ id });
    const getFavs = await this.favsRep.findOneBy({ userId });

    if (!getArtist)
      throw new UnprocessableEntityException('Artist id doesnt exists');
    const isAlreadeInFavs = getFavs.artists.some((el) => el === id);
    if (!isAlreadeInFavs)
      throw new NotFoundException('Artist is not found in favorites');
    const filteredArtist = isAlreadeInFavs
      ? getFavs.artists.filter((el) => el !== id)
      : getFavs.artists;

    await this.favsRep.save({ ...getFavs, artists: [...filteredArtist] });

    return;
  }
}
