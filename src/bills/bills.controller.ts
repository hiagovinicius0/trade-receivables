import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { PaginatedOccurrences } from 'src/generics/dtos/paginated-occurrences';
import { BillsService } from './bills.service';
import { BillIdResponse } from './constants';
import { CreateBillDto } from './dto/dtos/create-bill.dto';
import { UpdateBillDto } from './dto/dtos/update-bill.dto';
import { Bill } from './models/Bill';

@Controller('bills')
@ApiTags('Bills')
export class BillsController {
  constructor(private readonly billsService: BillsService) {}

  @Post()
  create(@Body() createBillDto: CreateBillDto): Promise<Bill> {
    return this.billsService.create(createBillDto);
  }

  @Get()
  @ApiQuery({
    name: 'page',
    required: false,
  })
  @ApiQuery({
    name: 'perPage',
    required: false,
  })
  findAll(
    @Query('perPage', new DefaultValuePipe(10), ParseIntPipe) perPage: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ): Promise<PaginatedOccurrences<Bill>> {
    return this.billsService.findAll(page, perPage);
  }

  @Get(':billId')
  findOne(@Param('billId') billId: string): Promise<Bill> {
    return this.billsService.findOne(billId);
  }

  @Patch(':billId')
  update(
    @Param('billId') billId: string,
    @Body() updateBillDto: UpdateBillDto,
  ): Promise<Bill> {
    return this.billsService.update(billId, updateBillDto);
  }

  @Delete(':billId')
  remove(@Param('billId') billId: string): Promise<BillIdResponse> {
    return this.billsService.remove(billId);
  }
}
