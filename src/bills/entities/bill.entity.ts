import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Bill } from '../models/Bill';

@Entity('bill')
export class BillEntity implements Bill {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column('bigint')
  correctedAmount: number;

  @Column('bigint')
  originalAmount: number;

  @Column()
  daysOfLate: number;

  @Column({ type: 'date' })
  paymentDate: string;

  @Column({ type: 'date' })
  dueDate: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
