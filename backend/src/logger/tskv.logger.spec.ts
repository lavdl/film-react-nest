import { TskvLogger } from './tskv.logger';

describe('TskvLogger', () => {
  let logger: TskvLogger;

  beforeEach(() => {
    logger = new TskvLogger();
  });

  it('log() пишет лог в формате TSKV в console.log', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});

    logger.log('Сервис успешно запущен', { версия: '1.0.0' });

    expect(spy).toHaveBeenCalledTimes(1);

    const line = String(spy.mock.calls[0][0]);

    expect(line.startsWith('tskv\t')).toBe(true);
    expect(line).toContain('\tlevel=log');
    expect(line).toContain('\tmessage=Сервис успешно запущен');
    expect(line).toContain('\toptionalParams=');
    expect(line).toContain('\ttime=');

    spy.mockRestore();
  });

  it('корректно экранирует табуляции и переносы строк', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});

    logger.log('Строка\tс табом\nи переносом');

    const line = String(spy.mock.calls[0][0]);

    expect(line).toContain('message=Строка\\tс табом\\nи переносом');

    spy.mockRestore();
  });

  it('error() пишет лог ошибки в console.error', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

    logger.error('Критическая ошибка приложения');

    const line = String(spy.mock.calls[0][0]);

    expect(line).toContain('\tlevel=error');
    expect(line).toContain('message=Критическая ошибка приложения');

    spy.mockRestore();
  });

  it('warn() пишет предупреждение в console.warn', () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    logger.warn('Недостаточно свободной памяти');

    const line = String(spy.mock.calls[0][0]);

    expect(line).toContain('\tlevel=warn');
    expect(line).toContain('message=Недостаточно свободной памяти');

    spy.mockRestore();
  });
});
