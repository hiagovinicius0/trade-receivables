import { Bill } from 'src/bills/models/Bill';

export type AddBillDto = Omit<
  Bill,
  | 'correctedAmount'
  | 'daysOfLate'
  | 'id'
  | 'createdAt'
  | 'updatedAt'
  | 'deletedAt'
>;
