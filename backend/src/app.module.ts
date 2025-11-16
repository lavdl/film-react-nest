import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { configProvider } from './app.config.provider';
import { MongooseModule } from '@nestjs/mongoose';

import { FilmsModule } from './films/films.module';
import { OrderController } from './order/order.controller';
import { OrderService } from './order/order.service';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public', 'content', 'afisha'),
      serveRoot: '/content/afisha',
    }),

    MongooseModule.forRoot(process.env.DATABASE_URL),

    FilmsModule,
  ],

  controllers: [OrderController],

  providers: [configProvider, OrderService],
})
export class AppModule {}
