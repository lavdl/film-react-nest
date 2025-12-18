import { Test } from '@nestjs/testing';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';

describe('FilmsController', () => {
  let controller: FilmsController;
  let filmsService: jest.Mocked<FilmsService>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [
        {
          provide: FilmsService,
          useValue: {
            findAll: jest.fn(),
            findScheduleById: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = moduleRef.get(FilmsController);
    filmsService = moduleRef.get(FilmsService);
  });

  it('getFilms() возвращает { total, items }', async () => {
    const items = [
      {
        id: 'film-1',
        title: 'Тестовый фильм',
        director: 'Режиссёр',
        rating: 8.7,
        tags: ['драма'],
        image: 'img.jpg',
        cover: 'cover.jpg',
        about: 'Коротко',
        description: 'Описание',
        schedule: [],
      },
    ];

    filmsService.findAll.mockResolvedValue(items as any);

    const res = await controller.getFilms();

    expect(filmsService.findAll).toHaveBeenCalledTimes(1);
    expect(res).toEqual({ total: 1, items });
  });

  it('getFilmSchedule(id) возвращает { total, items }', async () => {
    const schedule = [
      {
        id: 'session-1',
        daytime: '2025-12-18T10:00:00.000Z',
        hall: 1,
        rows: 10,
        seats: 15,
        price: 450,
        taken: ['1:1'],
      },
    ];

    filmsService.findScheduleById.mockResolvedValue(schedule as any);

    const res = await controller.getFilmSchedule('film-1');

    expect(filmsService.findScheduleById).toHaveBeenCalledWith('film-1');
    expect(res).toEqual({ total: 1, items: schedule });
  });

  it('getFilmSchedule(id) если сервис вернул пусто — total=0', async () => {
    filmsService.findScheduleById.mockResolvedValue([]);

    const res = await controller.getFilmSchedule('film-x');

    expect(res).toEqual({ total: 0, items: [] });
  });
});
