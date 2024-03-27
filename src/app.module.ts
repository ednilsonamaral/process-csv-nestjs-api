import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CsvModule } from './csv/csv.module';

import constants from '../config/constants';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [constants],
      isGlobal: true,
    }),
    CsvModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
