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
import { AlbumService } from './album.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { idParam } from 'src/common-dto/idParam.dto';

@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Post()
  create(@Body() createAlbumDto: CreateAlbumDto) {
    return this.albumService.create(createAlbumDto);
  }

  @Get()
  findAll() {
    return this.albumService.findAll();
  }

  @Get(':id')
  findOne(@Param() id: idParam) {
    return this.albumService.findOne(id);
  }

  @Put(':id')
  update(@Param() params: idParam, @Body() updateAlbumDto: UpdateAlbumDto) {
    return this.albumService.update(params, updateAlbumDto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param() params: idParam) {
    return this.albumService.remove(params);
  }
}
