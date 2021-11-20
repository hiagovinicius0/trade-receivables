import { Bill } from 'src/bills/models/Bill';

export interface AddBillDto
  extends Omit<
    Bill,
    | 'correctedAmount'
    | 'daysOfLate'
    | 'id'
    | 'createdAt'
    | 'updatedAt'
    | 'deletedAt'
    | 'paymentDate'
    | 'dueDate'
  > {
  dueDate: string;
  paymentDate: string;
}
