import { Injectable } from '@nestjs/common';

@Injectable()
export class DatesService {
  withoutTime(dateTime: Date): Date {
    const date = new Date(dateTime.getTime());
    date.setHours(0, 0, 0, 0);

    return date;
  }

  differenceBetweenDates(pastDate: string, futureDate: string): number {
    const diff = Math.abs(
      this.withoutTime(new Date(futureDate)).getTime() -
        this.withoutTime(new Date(pastDate)).getTime(),
    );
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    return days;
  }
}
