import { Injectable } from '@nestjs/common';
import { FilmsRepository } from '../repository/films.repository';
import { FilmDto, ScheduleDto } from './dto/films.dto';
import { FilmDocument } from './film.schema';

@Injectable()
export class FilmsService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  async findAll(): Promise<FilmDto[]> {
    return this.filmsRepository.findAll();
  }

  async findScheduleById(id: string): Promise<ScheduleDto[]> {
    const film = await this.filmsRepository.findSchedule(id);
    return film?.schedule ?? [];
  }

  async findById(id: string): Promise<FilmDocument> {
    return this.filmsRepository.findById(id);
  }

  async save(film: FilmDocument): Promise<FilmDocument> {
    return film.save();
  }
}
