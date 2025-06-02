import { Controller, Get, Post, Param, Delete, HttpCode } from '@nestjs/common';
import { FavsService } from './favs.service';

@Controller('favs')
export class FavsController {
  constructor(private readonly favsService: FavsService) {}
  @Get()
  findAll() {
    return this.favsService.findAll();
  }
  @Post('/track/:id')
  addTrack(@Param('id') id: string) {
    return this.favsService.addTrack(id);
  }
  @Post('/album/:id')
  addAlbum(@Param('id') id: string) {
    return this.favsService.addAlbum(id);
  }
  @Post('/artist/:id')
  addArtist(@Param('id') id: string) {
    return this.favsService.addArtist(id);
  }

  @Delete('/track/:id')
  @HttpCode(204)
  removeTrack(@Param('id') id: string) {
    return this.favsService.removeTrack(id);
  }
  @Delete('/album/:id')
  @HttpCode(204)
  removeAlbum(@Param('id') id: string) {
    return this.favsService.removeAlbum(id);
  }
  @Delete('/artist/:id')
  @HttpCode(204)
  removeArtist(@Param('id') id: string) {
    return this.favsService.removeArtist(id);
  }
}
