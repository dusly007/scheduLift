import { Module } from '@nestjs/common';
import { WaitListService } from './wait-list.service';
import { WaitListController } from './wait-list.controller';

@Module({
  providers: [WaitListService],
  controllers: [WaitListController]
})
export class WaitListModule {}
