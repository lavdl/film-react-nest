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
      const { film, session, row, seat, price } = t;

      const seatCode = `${row}:${seat}`;
      const localKey = `${film}:${session}:${seatCode}`;

      if (localSeats.has(localKey)) {
        throw new BadRequestException(
          `Повторяющееся место в заказе: фильм ${film}, сеанс ${session}, ряд ${row}, место ${seat}`,
        );
      }
      localSeats.add(localKey);

      const filmData = await this.filmsService.findById(film);
      if (!filmData) {
        throw new BadRequestException(`Фильм не найден: ${film}`);
      }

      const schedule = filmData.schedule.find((s) => s.id === session);
      if (!schedule) {
        throw new BadRequestException(`Сеанс не найден: ${session}`);
      }

      const seatTakenCode = `${row}:${seat}`;
      if (schedule.taken.includes(seatTakenCode)) {
        throw new BadRequestException(
          `Место уже занято: ряд ${row}, место ${seat}`,
        );
      }

      schedule.taken.push(seatTakenCode);

      resultItems.push({
        film,
        session,
        daytime: schedule.daytime,
        row,
        seat,
        price: price ?? schedule.price,
        id: randomUUID(),
      });

      await filmData.save();
    }

    return {
      total: resultItems.length,
      items: resultItems,
    };
  }
}
