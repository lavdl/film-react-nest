import { Test } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

describe('OrderController', () => {
  let controller: OrderController;
  let orderService: jest.Mocked<OrderService>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: {
            createOrder: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = moduleRef.get(OrderController);
    orderService = moduleRef.get(OrderService);
  });

  it('createOrder(dto) проксирует вызов в OrderService и возвращает результат', async () => {
    const dto = {
      email: 'user@yandex.ru',
      phone: '+79990000000',
      tickets: [
        {
          film: 'film-1',
          session: 'session-1',
          row: 2,
          seat: 5,
          price: 450,
        },
      ],
    };

    const serviceResult = {
      total: 1,
      items: [
        {
          film: 'film-1',
          session: 'session-1',
          daytime: '2025-12-18T10:00:00.000Z',
          row: 2,
          seat: 5,
          price: 450,
          id: 'order-item-id',
        },
      ],
    };

    orderService.createOrder.mockResolvedValue(serviceResult as any);

    const res = await controller.createOrder(dto as any);

    expect(orderService.createOrder).toHaveBeenCalledTimes(1);
    expect(orderService.createOrder).toHaveBeenCalledWith(dto);
    expect(res).toEqual(serviceResult);
  });
});
