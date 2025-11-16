import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Film, FilmDocument } from '../films/film.schema';

@Injectable()
export class FilmsRepository {
  constructor(@InjectModel(Film.name) private filmModel: Model<FilmDocument>) {}

  findAll() {
    return this.filmModel.find().lean().exec();
  }

  async findById(id: string) {
    return this.filmModel.findOne({ id }).exec();
  }

  async findSchedule(id: string) {
    return this.filmModel
      .findOne({ id }, { schedule: 1, _id: 0 })
      .lean()
      .exec();
  }
}
