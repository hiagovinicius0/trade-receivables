import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsISO8601,
  IsNotEmpty,
  IsNumber,
  MaxLength,
} from 'class-validator';
import { AddBillDto } from '../interfaces/add-bill.dto';

export class CreateBillDto implements AddBillDto {
  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  originalAmount: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsISO8601()
  @IsDateString()
  paymentDate: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsISO8601()
  @IsDateString()
  dueDate: string;
}
