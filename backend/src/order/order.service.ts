import { Injectable, BadRequestException } from '@nestjs/common';
import { FilmsService } from '../films/films.service';
import { CreateOrderDto } from './dto/order.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class OrderService {
  constructor(private readonly filmsService: FilmsService) {}

  async createOrder(dto: CreateOrderDto) {
    const { tickets } = dto;

    if (!tickets || tickets.length === 0) {
      throw new BadRequestException('Не переданы билеты');
    }

    const resultItems = [];
    const localSeats = new Set<string>();

    for (const t of tickets) {
      const { film: filmId, session, row, seat, price } = t;

      const seatCode = `${row}:${seat}`;
      const localKey = `${filmId}:${session}:${seatCode}`;

      if (localSeats.has(localKey)) {
        throw new BadRequestException(
          `Повторяющееся место в заказе: фильм ${filmId}, сеанс ${session}, ряд ${row}, место ${seat}`,
        );
      }
      localSeats.add(localKey);

      const filmData = await this.filmsService.findById(filmId);
      if (!filmData) {
        throw new BadRequestException(`Фильм не найден: ${filmId}`);
      }

      const schedule = filmData.schedule.find((s) => s.id === session);
      if (!schedule) {
        throw new BadRequestException(`Сеанс не найден: ${session}`);
      }

      const takenSeats = [...(schedule.taken || [])];

      if (takenSeats.includes(seatCode)) {
        throw new BadRequestException(
          `Место уже занято: ряд ${row}, место ${seat}`,
        );
      }

      takenSeats.push(seatCode);

      schedule.taken = takenSeats;

      await this.filmsService.saveSchedule(schedule);

      resultItems.push({
        film: filmId,
        session,
        daytime: schedule.daytime,
        row,
        seat,
        price: price ?? schedule.price,
        id: randomUUID(),
      });
    }

    return {
      total: resultItems.length,
      items: resultItems,
    };
  }
}
