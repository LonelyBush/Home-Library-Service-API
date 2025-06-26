import { Controller, Get, Post, Param, HttpCode, Delete } from '@nestjs/common';
import { FavsService } from './favs.service';
import { favsParams } from '../_dto/idParam.dto';

@Controller('favs')
export class FavsController {
  constructor(private readonly favsService: FavsService) {}
  @Get(':userId')
  findAll(@Param('userId') userId: string) {
    return this.favsService.findAll(userId);
  }
  @Post('/track/:userId/:id/')
  addTrack(@Param() params: favsParams) {
    return this.favsService.addTrack(params);
  }
  @Post('/album/:userId/:id/')
  addAlbum(@Param() params: favsParams) {
    return this.favsService.addAlbum(params);
  }
  @Post('/artist/:userId/:id/')
  addArtist(@Param() params: favsParams) {
    return this.favsService.addArtist(params);
  }

  @Delete('/track/:userId/:id/')
  @HttpCode(204)
  removeTrack(@Param() params: favsParams) {
    return this.favsService.removeTrack(params);
  }
  @Delete('/album/:userId/:id/')
  @HttpCode(204)
  removeAlbum(@Param() params: favsParams) {
    return this.favsService.removeAlbum(params);
  }
  @Delete('/artist/:userId/:id/')
  @HttpCode(204)
  removeArtist(@Param() params: favsParams) {
    return this.favsService.removeArtist(params);
  }
}
