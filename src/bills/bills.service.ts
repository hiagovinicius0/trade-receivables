import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginatedOccurrences } from 'src/generics/dtos/paginated-occurrences';
import { Repository } from 'typeorm';
import { BillIdResponse } from './constants';
import { CreateBillDto } from './dto/create-bill.dto';
import { UpdateBillDto } from './dto/update-bill.dto';
import { BillEntity } from './entities/bill.entity';
import { Bill } from './models/Bill';

@Injectable()
export class BillsService {
  constructor(
    @InjectRepository(BillEntity) private billRepo: Repository<BillEntity>,
  ) {}
  create(createBillDto: CreateBillDto): Promise<Bill> {
    return this.billRepo.save(createBillDto);
  }

  async findAll(
    page: number,
    perPage: number,
  ): Promise<PaginatedOccurrences<Bill>> {
    const countBills = await this.billRepo.count();
    const allBills = await this.billRepo.find({
      skip: (page - 1) * perPage,
      take: perPage,
    });

    return {
      total: countBills,
      occurrences: allBills,
    };
  }

  findOne(billId: string): Promise<Bill> {
    return this.billRepo.findOneOrFail({
      where: { id: billId },
    });
  }

  async update(id: string, updateBillDto: UpdateBillDto): Promise<Bill> {
    const bill = await this.findOne(id);

    for (const key in updateBillDto) {
      bill[key] = updateBillDto[key];
    }

    return this.billRepo.save(bill);
  }

  async remove(billId: string): Promise<BillIdResponse> {
    await this.findOne(billId);
    await this.billRepo.softDelete(billId);

    return { billId };
  }
}
