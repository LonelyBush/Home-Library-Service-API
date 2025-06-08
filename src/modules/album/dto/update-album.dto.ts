import { PartialType } from '@nestjs/mapped-types';
import { CreateAlbumDto } from './create-album.dto';
import { IsNotEmpty, IsNumber, IsUUID, ValidateIf } from 'class-validator';

export class UpdateAlbumDto extends PartialType(CreateAlbumDto) {
  @IsNotEmpty({ message: 'name is required field !' })
  name: string;
  @IsNotEmpty({ message: 'year is required field !' })
  @IsNumber()
  year: number;
  @ValidateIf((o) => typeof o.artistId === 'string')
  @IsUUID()
  artistId: string | null; // refers to Artist
}
