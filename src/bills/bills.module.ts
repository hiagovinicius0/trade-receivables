import { Module } from '@nestjs/common';
import { BillsService } from './bills.service';
import { BillsController } from './bills.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillEntity } from './entities/bill.entity';
import { DatesModule } from 'src/dates/dates.module';

@Module({
  imports: [TypeOrmModule.forFeature([BillEntity]), DatesModule],
  controllers: [BillsController],
  providers: [BillsService],
})
export class BillsModule {}
