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
import { TrackService } from './track.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { idParam } from 'src/common-dto/idParam.dto';

@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Post()
  create(@Body() createTrackDto: CreateTrackDto) {
    return this.trackService.create(createTrackDto);
  }

  @Get()
  findAll() {
    return this.trackService.findAll();
  }

  @Get(':id')
  findOne(@Param() params: idParam) {
    return this.trackService.findOne(params);
  }

  @Put(':id')
  update(@Param() params: idParam, @Body() updateTrackDto: UpdateTrackDto) {
    return this.trackService.update(params, updateTrackDto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param() params: idParam) {
    return this.trackService.remove(params);
  }
}
