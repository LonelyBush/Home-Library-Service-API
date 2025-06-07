import {
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InMemoryMapDB } from 'src/innerDb/innerDb';
import { Favorites } from './entities/fav.entity';
import { Track } from '../track/entities/track.entity';
import { Artist } from '../artist/entities/artist.entity';
import { Album } from '../album/entities/album.entity';
import { idParam } from 'src/common-dto/idParam.dto';

@Injectable()
export class FavsService {
  constructor(@Inject('DATABASE') private readonly db: InMemoryMapDB) {}

  findAll() {
    return this.db.getAll('Favorites').map((el: Favorites) => ({
      albums: el.albums,
      tracks: el.tracks,
      artists: el.artists,
    }))[0];
  }
  addTrack(param: idParam) {
    const { id } = param;
    const findTrack = this.db.findById('Tracks', id, () => {
      throw new UnprocessableEntityException('Track id doesnt exists');
    }) as Track;

    if (findTrack) {
      const getFavsTracks = this.db
        .getAll('Favorites')
        .map((el: Favorites & { id: string }) => ({
          tracks: el.tracks,
          id: el.id,
        }))[0];
      const isAlreadyinFavs = getFavsTracks.tracks.some(
        (el) => el.id === findTrack.id,
      );
      if (!isAlreadyinFavs) {
        //pushed finded Track to favs
        getFavsTracks.tracks.push(findTrack);
        console.log(getFavsTracks);
        this.db.update(
          'Favorites',
          getFavsTracks.id,
          (oldData) => {
            return { ...oldData, tracks: getFavsTracks.tracks };
          },
          () => {
            throw new NotFoundException('Not found', {
              description: 'Favs is not found, try again',
            });
          },
        );
        return this.findAll();
      } else {
        return this.findAll();
      }
    }
  }
  addAlbum(param: idParam) {
    const { id } = param;
    const findAlbum = this.db.findById('Albums', id, () => {
      throw new UnprocessableEntityException('Album id doesnt exists');
    }) as Album;

    if (findAlbum) {
      const getFavsAlbums = this.db
        .getAll('Favorites')
        .map((el: Favorites & { id: string }) => ({
          albums: el.albums,
          id: el.id,
        }))[0];
      const isAlreadyinFavs = getFavsAlbums.albums.some(
        (el) => el.id === findAlbum.id,
      );
      if (!isAlreadyinFavs) {
        //pushed finded Albums to favs
        getFavsAlbums.albums.push(findAlbum);
        console.log(getFavsAlbums);
        this.db.update(
          'Favorites',
          getFavsAlbums.id,
          (oldData) => {
            return { ...oldData, albums: getFavsAlbums.albums };
          },
          () => {
            throw new NotFoundException('Not found', {
              description: 'Favs is not found, try again',
            });
          },
        );
        return this.findAll();
      } else {
        return this.findAll();
      }
    }
  }
  addArtist(param: idParam) {
    const { id } = param;
    const findArtist = this.db.findById('Artists', id, () => {
      throw new UnprocessableEntityException('Artist id doesnt exists');
    }) as Artist;

    if (findArtist) {
      const getFavsArtists = this.db
        .getAll('Favorites')
        .map((el: Favorites & { id: string }) => ({
          artists: el.artists,
          id: el.id,
        }))[0];

      const isAlreadyinFavs = getFavsArtists.artists.some(
        (el) => el.id === findArtist.id,
      );
      if (!isAlreadyinFavs) {
        //pushed finded Artists to favs
        getFavsArtists.artists.push(findArtist);
        console.log(getFavsArtists);
        this.db.update(
          'Favorites',
          getFavsArtists.id,
          (oldData) => {
            return { ...oldData, artists: getFavsArtists.artists };
          },
          () => {
            throw new NotFoundException('Not found', {
              description: 'Favs is not found, try again',
            });
          },
        );
        return this.findAll();
      } else {
        return this.findAll();
      }
    }
  }

  removeTrack(param: idParam) {
    const { id } = param;
    const findTrack = this.db.findById('Tracks', id, () => {
      throw new NotFoundException('Tracks is not found, try again');
    }) as Track;
    if (findTrack) {
      const getFavsTracks = this.db
        .getAll('Favorites')
        .map((el: Favorites & { id: string }) => ({
          tracks: el.tracks,
          id: el.id,
        }))[0];

      //removed finded Track from favs
      const isAlreadyinFavs = getFavsTracks.tracks.some(
        (el) => el.id === findTrack.id,
      );
      if (isAlreadyinFavs) {
        const filteredTracks = getFavsTracks.tracks.filter(
          (el) => el.id !== findTrack.id,
        );
        this.db.update(
          'Favorites',
          getFavsTracks.id,
          (oldData) => {
            return { ...oldData, tracks: filteredTracks };
          },
          () => {
            throw new NotFoundException('Not found', {
              description: 'Favs is not found, try again',
            });
          },
        );
        return this.findAll();
      } else {
        throw new NotFoundException('Current track is not in favorites');
      }
    }
  }
  removeAlbum(param: idParam) {
    const { id } = param;
    const findAlbum = this.db.findById('Albums', id, () => {
      throw new NotFoundException('Album is not found, try again');
    }) as Album;
    if (findAlbum) {
      const getFavsAlbum = this.db
        .getAll('Favorites')
        .map((el: Favorites & { id: string }) => ({
          albums: el.albums,
          id: el.id,
        }))[0];

      const isAlreadyinFavs = getFavsAlbum.albums.some(
        (el) => el.id === findAlbum.id,
      );
      if (isAlreadyinFavs) {
        //removed finded Track from favs
        const filteredTracks = getFavsAlbum.albums.filter(
          (el) => el.id !== findAlbum.id,
        );
        this.db.update(
          'Favorites',
          getFavsAlbum.id,
          (oldData) => {
            return { ...oldData, albums: filteredTracks };
          },
          () => {
            throw new NotFoundException('Not found', {
              description: 'Favs is not found, try again',
            });
          },
        );
        return this.findAll();
      } else {
        throw new NotFoundException('Current album is not in favorites');
      }
    }
  }
  removeArtist(param: idParam) {
    const { id } = param;
    const findArtist = this.db.findById('Artists', id, () => {
      throw new UnprocessableEntityException('Artist id doesnt exists');
    }) as Artist;
    if (findArtist) {
      const getFavsArtists = this.db
        .getAll('Favorites')
        .map((el: Favorites & { id: string }) => ({
          artists: el.artists,
          id: el.id,
        }))[0];

      const isAlreadyinFavs = getFavsArtists.artists.some(
        (el) => el.id === findArtist.id,
      );
      if (isAlreadyinFavs) {
        //removed finded Track from favs
        const filteredTracks = getFavsArtists.artists.filter(
          (el) => el.id !== findArtist.id,
        );
        this.db.update(
          'Favorites',
          getFavsArtists.id,
          (oldData) => {
            return { ...oldData, artists: filteredTracks };
          },
          () => {
            throw new NotFoundException('Not found', {
              description: 'Favs is not found, try again',
            });
          },
        );
        return this.findAll();
      } else {
        throw new NotFoundException('Current artist is not in favorites');
      }
    }
  }
}
