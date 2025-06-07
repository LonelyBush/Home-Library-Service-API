import { Controller, Get, Post, Param, Delete, HttpCode } from '@nestjs/common';
import { FavsService } from './favs.service';
import { idParam } from 'src/common-dto/idParam.dto';

@Controller('favs')
export class FavsController {
  constructor(private readonly favsService: FavsService) {}
  @Get()
  findAll() {
    return this.favsService.findAll();
  }
  @Post('/track/:id')
  addTrack(@Param() params: idParam) {
    return this.favsService.addTrack(params);
  }
  @Post('/album/:id')
  addAlbum(@Param() params: idParam) {
    return this.favsService.addAlbum(params);
  }
  @Post('/artist/:id')
  addArtist(@Param() params: idParam) {
    return this.favsService.addArtist(params);
  }

  @Delete('/track/:id')
  @HttpCode(204)
  removeTrack(@Param() params: idParam) {
    return this.favsService.removeTrack(params);
  }
  @Delete('/album/:id')
  @HttpCode(204)
  removeAlbum(@Param() params: idParam) {
    return this.favsService.removeAlbum(params);
  }
  @Delete('/artist/:id')
  @HttpCode(204)
  removeArtist(@Param() params: idParam) {
    return this.favsService.removeArtist(params);
  }
}
