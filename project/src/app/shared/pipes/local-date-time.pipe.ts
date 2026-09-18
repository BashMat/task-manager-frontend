import { Pipe, PipeTransform } from '@angular/core';

export function parseBackendDate(value: string): Date {
  const raw = value.trim();
  const hasTimezone = /[zZ]$|[+-]\d{2}:?\d{2}$/.test(raw);
  const normalized = raw.includes('T') && !hasTimezone ? raw + 'Z' : raw;
  return new Date(normalized);
}

@Pipe({ name: 'localDateTime', standalone: true })
export class LocalDateTimePipe implements PipeTransform {
  transform(value: string | Date | null | undefined): string {
    if (value === null || value === undefined || value === '') {
      return '';
    }

    const date = value instanceof Date ? value : parseBackendDate(value);

    if (isNaN(date.getTime())) {
      return typeof value === 'string' ? value : '';
    }

    return date.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
  }
}