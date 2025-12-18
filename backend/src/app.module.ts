import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { FilmsModule } from './films/films.module';
import { OrderController } from './order/order.controller';
import { OrderService } from './order/order.service';
import { OrmConfigModule } from './app.orm-config';
import { LoggerModule } from './logger/logger.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public', 'content', 'afisha'),
      serveRoot: '/content/afisha',
    }),

    LoggerModule,
    OrmConfigModule,
    FilmsModule,
  ],

  controllers: [OrderController],
  providers: [OrderService],
})
export class AppModule {}
