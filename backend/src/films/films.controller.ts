import { Controller, Get, Param } from '@nestjs/common';
import { FilmsService } from './films.service';
import { FilmDto, ScheduleDto } from '../films/dto/films.dto';

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Get()
  async getFilms(): Promise<{ total: number; items: FilmDto[] }> {
    const items = await this.filmsService.findAll();

    return {
      total: items.length,
      items,
    };
  }

  @Get(':id/schedule')
  async getFilmSchedule(
    @Param('id') id: string,
  ): Promise<{ total: number; items: ScheduleDto[] }> {
    const items = await this.filmsService.findScheduleById(id);

    return {
      total: items.length,
      items,
    };
  }
}
