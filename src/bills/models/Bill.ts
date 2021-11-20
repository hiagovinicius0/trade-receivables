import { DateColumns } from '../../generics/models/constants';

export interface Bill extends DateColumns {
  id: string;
  name: string;
  originalAmount: number;
  correctedAmount: number;
  daysOfLate: number;
  paymentDate: string;
  dueDate: string;
}
