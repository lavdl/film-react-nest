import { JsonLogger } from './json.logger';

describe('JsonLogger', () => {
  let logger: JsonLogger;

  beforeEach(() => {
    logger = new JsonLogger();
  });

  it('log() пишет JSON-лог в console.log', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});

    logger.log('Приложение запущено', { порт: 3000 });

    expect(spy).toHaveBeenCalledTimes(1);

    const payload = JSON.parse(String(spy.mock.calls[0][0]));

    expect(payload.level).toBe('log');
    expect(payload.message).toBe('Приложение запущено');
    expect(payload.optionalParams).toEqual([{ порт: 3000 }]);
    expect(typeof payload.time).toBe('string');

    spy.mockRestore();
  });

  it('error() пишет JSON-лог в console.error', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

    logger.error('Ошибка подключения к базе данных');

    const payload = JSON.parse(String(spy.mock.calls[0][0]));

    expect(payload.level).toBe('error');
    expect(payload.message).toBe('Ошибка подключения к базе данных');

    spy.mockRestore();
  });

  it('warn() пишет JSON-лог в console.warn', () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    logger.warn('Используется устаревший API');

    const payload = JSON.parse(String(spy.mock.calls[0][0]));

    expect(payload.level).toBe('warn');
    expect(payload.message).toBe('Используется устаревший API');

    spy.mockRestore();
  });
});
