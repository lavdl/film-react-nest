import { Injectable } from '@nestjs/common';
import { FilmsRepository } from '../repository/films.repository';
import { FilmDto, ScheduleDto } from './dto/films.dto';
import { Film } from './film.entity';
import { Schedule } from '../films/schedule.entity';

@Injectable()
export class FilmsService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  async findAll(): Promise<FilmDto[]> {
    const films = await this.filmsRepository.findAll();

    return films.map((film) => this.toFilmDto(film));
  }

  async findScheduleById(id: string): Promise<ScheduleDto[]> {
    const film = await this.filmsRepository.findById(id);
    if (!film) return [];

    return film.schedule.map((s) => this.toScheduleDto(s));
  }

  async findById(id: string): Promise<Film | null> {
    return this.filmsRepository.findById(id);
  }

  async saveSchedule(schedule: Schedule): Promise<Schedule> {
    return this.filmsRepository.saveSchedule(schedule);
  }

  private toFilmDto(film: Film): FilmDto {
    return {
      id: film.id,
      title: film.title,
      director: film.director,
      rating: film.rating,
      tags: film.tags ? film.tags.split(',') : [],
      image: film.image,
      cover: film.cover,
      about: film.about,
      description: film.description,
      schedule: film.schedule.map((s) => this.toScheduleDto(s)),
    };
  }

  private toScheduleDto(schedule: any): ScheduleDto {
    return {
      id: schedule.id,
      daytime: schedule.daytime,
      hall: schedule.hall,
      rows: schedule.rows,
      seats: schedule.seats,
      price: schedule.price,
      taken: schedule.taken ? schedule.taken.split(',') : [],
    };
  }
}
