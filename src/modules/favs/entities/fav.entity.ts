import { Album } from 'src/modules/album/entities/album.entity';
import { Artist } from 'src/modules/artist/entities/artist.entity';
import { Track } from 'src/modules/track/entities/track.entity';

export class Favorites {
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
}
