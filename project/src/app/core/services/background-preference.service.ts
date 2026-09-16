import { Injectable, inject, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export interface BackgroundOption {
  name: string;
  hex: string;
}

@Injectable({ providedIn: 'root' })
export class BackgroundPreferenceService {
  private readonly document = inject(DOCUMENT);

  private static readonly STORAGE_KEY = 'page_background_color';
  private static readonly HEX_PATTERN = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

  readonly options: BackgroundOption[] = [
    { name: 'Neutral grey', hex: '#f1f1f6' },
    { name: 'Warm sand', hex: '#f4efe8' },
    { name: 'Cool mist', hex: '#eceff3' },
    { name: 'Slate', hex: '#e1e5ec' },
    { name: 'Blush', hex: '#f6dad5' },
    { name: 'Dusty rose', hex: '#e7bcb5' },
    { name: 'Petal', hex: '#f6e1ee' },
    { name: 'Clay', hex: '#d69182' },
    { name: 'Terracotta', hex: '#c67d67' },
    { name: 'Classic coral', hex: '#e66465' },
    { name: 'Peach', hex: '#f7e2cf' },
    { name: 'Butter', hex: '#f7ecc9' },
    { name: 'Sage', hex: '#e3ecdd' },
    { name: 'Mint', hex: '#d9f0e6' },
    { name: 'Azure tint', hex: '#e4ecf6' },
    { name: 'Sky', hex: '#d9e8f5' },
    { name: 'Lilac', hex: '#ece1f4' },
    { name: 'Periwinkle', hex: '#e4e6f7' }
  ];

  private readonly DEFAULT_HEX = '#e1e5ec';

  readonly current = signal<string>(this.DEFAULT_HEX);

  init(): void {
    const saved = localStorage.getItem(BackgroundPreferenceService.STORAGE_KEY);
    let hex = this.DEFAULT_HEX;
    if (saved !== null) {
      try {
        const parsed: unknown = JSON.parse(saved);
        if (this.isValidHex(parsed)) {
          hex = parsed;
        }
      } catch (error) {
        console.error('Failed to parse stored background color', error);
      }
    }
    this.previewColor(hex);
  }

  previewColor(hex: string): void {
    if (!this.isValidHex(hex)) {
      return;
    }
    this.current.set(hex);
    this.document.body.style.setProperty('--app-bg', hex);
  }

  setColor(hex: string): void {
    if (!this.isValidHex(hex)) {
      return;
    }
    this.previewColor(hex);
    localStorage.setItem(BackgroundPreferenceService.STORAGE_KEY, JSON.stringify(hex));
  }

  private isValidHex(value: unknown): value is string {
    return typeof value === 'string' && BackgroundPreferenceService.HEX_PATTERN.test(value);
  }
}