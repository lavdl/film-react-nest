import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Film } from '../films/film.entity';
import { Schedule } from '../films/schedule.entity';

@Injectable()
export class FilmsRepository {
  constructor(
    @InjectRepository(Film)
    private readonly repo: Repository<Film>,
  ) {}

  findAll(): Promise<Film[]> {
    return this.repo.find({ relations: ['schedule'] });
  }

  findById(id: string): Promise<Film | null> {
    return this.repo.findOne({
      where: { id },
      relations: ['schedule'],
    });
  }

  async findSchedule(id: string): Promise<Schedule[]> {
    const film = await this.repo.findOne({
      where: { id },
      relations: ['schedule'],
    });
    return film?.schedule || [];
  }

  async saveSchedule(schedule: Schedule): Promise<Schedule> {
    return this.repo.manager.save(schedule);
  }
}
