import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DevLogger } from './dev.logger';
import { JsonLogger } from './json.logger';
import { TskvLogger } from './tskv.logger';
import { LoggerService } from '@nestjs/common';

export const APP_LOGGER = Symbol('APP_LOGGER');

@Module({
  imports: [ConfigModule],
  providers: [
    DevLogger,
    JsonLogger,
    TskvLogger,
    {
      provide: APP_LOGGER,
      inject: [ConfigService, DevLogger, JsonLogger, TskvLogger],
      useFactory: (
        config: ConfigService,
        dev: DevLogger,
        json: JsonLogger,
        tskv: TskvLogger,
      ): LoggerService => {
        const mode = (config.get<string>('LOGGER') || 'dev').toLowerCase();
        if (mode === 'json') return json;
        if (mode === 'tskv') return tskv;
        return dev;
      },
    },
  ],
  exports: [APP_LOGGER],
})
export class LoggerModule {}
