import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'localDateTime', standalone: true })
export class LocalDateTimePipe implements PipeTransform {
  transform(value: string | Date | null | undefined): string {
    if (value === null || value === undefined || value === '') {
      return '';
    }

    let date: Date;
    if (value instanceof Date) {
      date = value;
    } else {
      const raw = value.trim();
      const hasTimezone = /[zZ]$|[+-]\d{2}:?\d{2}$/.test(raw);
      const normalized = raw.includes('T') && !hasTimezone ? raw + 'Z' : raw;
      date = new Date(normalized);
    }

    if (isNaN(date.getTime())) {
      return typeof value === 'string' ? value : '';
    }

    return date.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
  }
}