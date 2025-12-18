import { Injectable, LoggerService } from '@nestjs/common';

@Injectable()
export class TskvLogger implements LoggerService {
  private esc(v: any): string {
    const s = typeof v === 'string' ? v : JSON.stringify(v);
    return s
      .replace(/\\/g, '\\\\')
      .replace(/\t/g, '\\t')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r');
  }

  private toTskv(level: string, message: any, optionalParams: any[]) {
    const fields: Record<string, string> = {
      time: new Date().toISOString(),
      level,
      message: this.esc(message),
    };

    if (optionalParams?.length) {
      fields.optionalParams = this.esc(optionalParams);
    }

    return (
      'tskv\t' +
      Object.entries(fields)
        .map(([k, v]) => `${k}=${v}`)
        .join('\t')
    );
  }

  log(message: any, ...optionalParams: any[]) {
    console.log(this.toTskv('log', message, optionalParams));
  }

  error(message: any, ...optionalParams: any[]) {
    console.error(this.toTskv('error', message, optionalParams));
  }

  warn(message: any, ...optionalParams: any[]) {
    console.warn(this.toTskv('warn', message, optionalParams));
  }

  debug(message: any, ...optionalParams: any[]) {
    console.debug(this.toTskv('debug', message, optionalParams));
  }

  verbose(message: any, ...optionalParams: any[]) {
    console.info(this.toTskv('verbose', message, optionalParams));
  }

  setLogLevels?(_levels: string[]) {}
}
