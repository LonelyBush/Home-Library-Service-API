import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Favorites } from './entities/fav.entity';
import { idParam } from 'src/modules/_dto/idParam.dto';
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

  async initializeFavorites(): Promise<Favorites> {
    const count = await this.favsRep.count();

    if (count === 0) {
      const newFav = this.favsRep.create({
        artists: [],
        albums: [],
        tracks: [],
      });
      return this.favsRep.save(newFav);
    }
    return this.favsRep.findOne({ where: { id: 1 } });
  }
  async findAll() {
    const getFavs = await this.favsRep.findOne({ where: { id: 1 } });

    const [artists, albums, tracks] = await Promise.all([
      this.artistDb.findBy({ id: In(getFavs.artists) }),
      this.albumDb.findBy({ id: In(getFavs.albums) }),
      this.trackDb.findBy({ id: In(getFavs.tracks) }),
    ]);

    return { artists, albums, tracks };
  }
  async addTrack(param: idParam) {
    const { id } = param;
    const getTrack = await this.trackDb.findOneBy({ id });
    const getFavs = await this.favsRep.findOneBy({ id: 1 });

    if (!getTrack)
      throw new UnprocessableEntityException('Track id doesnt exists');

    const isAlreadeInFavs = getFavs.tracks.some((el) => el === id);

    return isAlreadeInFavs
      ? this.favsRep.save({ ...getFavs, tracks: [...getFavs.tracks] })
      : this.favsRep.save({ ...getFavs, tracks: [...getFavs.tracks, id] });
  }
  async addAlbum(param: idParam) {
    const { id } = param;
    const getAlbum = await this.albumDb.findOneBy({ id });
    const getFavs = await this.favsRep.findOneBy({ id: 1 });

    if (!getAlbum)
      throw new UnprocessableEntityException('Album id doesnt exists');

    const isAlreadeInFavs = getFavs.albums.some((el) => el === id);

    return isAlreadeInFavs
      ? this.favsRep.save({ ...getFavs, albums: [...getFavs.albums] })
      : this.favsRep.save({ ...getFavs, albums: [...getFavs.albums, id] });
  }
  async addArtist(param: idParam) {
    const { id } = param;
    const getArtist = await this.artistDb.findOneBy({ id });
    const getFavs = await this.favsRep.findOneBy({ id: 1 });

    if (!getArtist)
      throw new UnprocessableEntityException('Artist id doesnt exists');

    const isAlreadeInFavs = getFavs.artists.some((el) => el === id);
    return isAlreadeInFavs
      ? this.favsRep.save({ ...getFavs, artists: [...getFavs.artists] })
      : this.favsRep.save({ ...getFavs, artists: [...getFavs.artists, id] });
  }

  async removeTrack(param: idParam) {
    const { id } = param;
    const getTrack = await this.trackDb.findOneBy({ id });
    const getFavs = await this.favsRep.findOneBy({ id: 1 });

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
  async removeAlbum(param: idParam) {
    const { id } = param;
    const getAlbum = await this.albumDb.findOneBy({ id });
    const getFavs = await this.favsRep.findOneBy({ id: 1 });

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

  async removeArtist(param: idParam) {
    const { id } = param;
    const getArtist = await this.artistDb.findOneBy({ id });
    const getFavs = await this.favsRep.findOneBy({ id: 1 });

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
