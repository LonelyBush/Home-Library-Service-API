import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CollectionTypes } from 'src/innerDb/innerDb';
import { TrackService } from 'src/services/track.service';
import { CreateTrackDto, UpdateTrackDto } from 'src/shemas/track.dto';

@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Get()
  getAll(): CollectionTypes[] {
    return this.trackService.getTracks();
  }
  @Get(':id')
  getSpecificUser(@Param('id') id: string): CollectionTypes {
    return this.trackService.getById(id);
  }

  @Post()
  create(@Body() createTrackDto: CreateTrackDto) {
    return this.trackService.createPost(createTrackDto);
  }

  @Put(':id')
  update(@Body() updateTrackDto: UpdateTrackDto, @Param('id') id: string) {
    return this.trackService.updateTrack(updateTrackDto, id);
  }

  @Delete(':id')
  @HttpCode(204)
  delete(@Param('id') id: string) {
    return this.trackService.delete(id);
  }
}
