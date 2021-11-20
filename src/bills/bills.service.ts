import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DatesService } from 'src/dates/dates.service';
import { PaginatedOccurrences } from 'src/generics/dtos/paginated-occurrences';
import { Repository } from 'typeorm';
import { BillIdResponse } from './constants';
import { CreateBillDto } from './dto/dtos/create-bill.dto';
import { UpdateBillDto } from './dto/dtos/update-bill.dto';
import { BillEntity } from './entities/bill.entity';
import { Bill } from './models/Bill';

@Injectable()
export class BillsService {
  constructor(
    @InjectRepository(BillEntity) private billRepo: Repository<BillEntity>,
    private datesService: DatesService,
  ) {}
  async create(createBillDto: CreateBillDto): Promise<Bill> {
    const daysOfLate = this.datesService.differenceBetweenDates(
      createBillDto.dueDate,
      createBillDto.paymentDate,
    );
    const correctedAmount = Math.trunc(
      this.calculateTax(daysOfLate, createBillDto.originalAmount) * 100,
    );
    const originalAmount = Math.trunc(createBillDto.originalAmount * 100);

    const bill = await this.billRepo.save({
      ...createBillDto,
      daysOfLate,
      correctedAmount,
      originalAmount,
    });

    return this.findOne(bill.id);
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

    allBills.map((bill) => {
      bill.originalAmount = bill.originalAmount / 100;
      bill.correctedAmount = bill.correctedAmount / 100;
    });

    return {
      total: countBills,
      occurrences: allBills,
    };
  }

  async findOne(billId: string): Promise<Bill> {
    const bill = await this.billRepo.findOneOrFail({
      where: { id: billId },
    });
    bill.originalAmount = bill.originalAmount / 100;
    bill.correctedAmount = bill.correctedAmount / 100;

    return bill;
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

  calculateTax(daysOfLate: number, originalAmount: number): number {
    if (daysOfLate === 1) return originalAmount;
    let fine = 0;
    let interest = 0;

    if (daysOfLate > 1 && daysOfLate < 4) {
      fine = 2;
      interest = 0.1;
    } else if (daysOfLate > 3 && daysOfLate < 5) {
      fine = 3;
      interest = 0.2;
    } else {
      fine = 5;
      interest = 0.3;
    }

    const calculateFine = (originalAmount * fine) / 100;
    const calculateInterest = (originalAmount * (interest * daysOfLate)) / 100;

    return originalAmount + calculateFine + calculateInterest;
  }
}
