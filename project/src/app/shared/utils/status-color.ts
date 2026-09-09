export interface StatusColor {
  bg: string;
  fg: string;
}

// TODO: Use colours from backend
const PALETTE: StatusColor[] = [
  { bg: '#e57373', fg: '#ffffff' },
  { bg: '#f06292', fg: '#ffffff' },
  { bg: '#ba68c8', fg: '#ffffff' },
  { bg: '#64b5f6', fg: '#ffffff' },
  { bg: '#4db6ac', fg: '#ffffff' },
  { bg: '#81c784', fg: '#1b1b1b' },
  { bg: '#ffb74d', fg: '#1b1b1b' },
  { bg: '#a1887f', fg: '#ffffff' }
];

const EMPTY: StatusColor = { bg: '#e0e0e0', fg: '#1b1b1b' };

export function statusColor(name: string): StatusColor {
  if (!name) {
    return EMPTY;
  }
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) | 0;
  }
  return PALETTE[Math.abs(hash) % PALETTE.length];
}