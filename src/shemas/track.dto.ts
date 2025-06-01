export interface CreateTrackDto {
  name: string;
  duration: number;
  artistId: string | null; // refers to Artist
  albumId: string | null; // refers to Album
}

export interface UpdateTrackDto {
  name: string;
  duration: number;
  artistId: string | null; // refers to Artist
  albumId: string | null; // refers to Album
}
