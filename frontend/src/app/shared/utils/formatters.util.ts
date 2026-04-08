export function formatCurrencyBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value ?? 0);
}

export function formatDateTimeBR(value: string): string {
  return new Date(value).toLocaleString('pt-BR');
}

export function parseCurrencyDigitsToNumber(rawValue: string): number {
  const digitsOnly = rawValue.replace(/\D/g, '');
  return Number(digitsOnly === '' ? '0' : digitsOnly) / 100;
}

export function isAllowedNumericInputKey(event: KeyboardEvent): boolean {
  const allowedControlKeys = new Set([
    'Backspace',
    'Delete',
    'Tab',
    'Enter',
    'Escape',
    'ArrowLeft',
    'ArrowRight',
    'Home',
    'End'
  ]);
  if (allowedControlKeys.has(event.key)) return true;
  if ((event.ctrlKey || event.metaKey) && ['a', 'c', 'v', 'x'].includes(event.key.toLowerCase())) return true;
  return /^\d$/.test(event.key);
}
