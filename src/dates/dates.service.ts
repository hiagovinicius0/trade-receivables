import { Injectable } from '@nestjs/common';

@Injectable()
export class DatesService {
  withoutTime(dateTime: Date): Date {
    const date = new Date(dateTime.getTime());
    date.setHours(0, 0, 0, 0);

    return date;
  }

  differenceBetweenDates(paymentDate: string, dueDate: string): number {
    if (new Date(paymentDate).getTime() <= new Date(dueDate).getTime())
      return 0;

    const diff = Math.abs(
      this.withoutTime(new Date(dueDate)).getTime() -
        this.withoutTime(new Date(paymentDate)).getTime(),
    );
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    return days;
  }
}
