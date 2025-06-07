import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  Put,
} from '@nestjs/common';
import { ArtistService } from './artist.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { idParam } from 'src/common-dto/idParam.dto';

@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Post()
  create(@Body() createArtistDto: CreateArtistDto) {
    return this.artistService.create(createArtistDto);
  }

  @Get()
  findAll() {
    return this.artistService.findAll();
  }

  @Get(':id')
  findOne(@Param() param: idParam) {
    return this.artistService.findOne(param);
  }

  @Put(':id')
  update(@Param() params: idParam, @Body() updateArtistDto: UpdateArtistDto) {
    return this.artistService.update(params, updateArtistDto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param() params: idParam) {
    return this.artistService.remove(params);
  }
}
