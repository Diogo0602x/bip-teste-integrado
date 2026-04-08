import { formatCurrencyBRL, formatDateTimeBR, isAllowedNumericInputKey, parseCurrencyDigitsToNumber } from './formatters.util';

describe('formatters.util', () => {
  it('formatCurrencyBRL trata undefined com 0', () => {
    expect(formatCurrencyBRL(undefined as unknown as number)).toContain('0,00');
  });

  it('formatCurrencyBRL formata valor', () => {
    expect(formatCurrencyBRL(10.5)).toMatch(/10/);
  });

  it('formatDateTimeBR formata ISO', () => {
    const s = formatDateTimeBR('2020-01-15T12:00:00.000Z');
    expect(s.length).toBeGreaterThan(0);
  });

  it('parseCurrencyDigitsToNumber ignora letras e símbolos', () => {
    expect(parseCurrencyDigitsToNumber('R$ 1a2b3,45')).toBe(123.45);
  });

  it('isAllowedNumericInputKey permite dígitos e bloqueia letra simples', () => {
    const digitEvent = { key: '5', ctrlKey: false, metaKey: false } as KeyboardEvent;
    const letterEvent = { key: 'a', ctrlKey: false, metaKey: false } as KeyboardEvent;
    expect(isAllowedNumericInputKey(digitEvent)).toBe(true);
    expect(isAllowedNumericInputKey(letterEvent)).toBe(false);
  });

  it('isAllowedNumericInputKey permite tecla de controle e atalho ctrl/cmd', () => {
    const controlEvent = { key: 'Backspace', ctrlKey: false, metaKey: false } as KeyboardEvent;
    const ctrlEvent = { key: 'v', ctrlKey: true, metaKey: false } as KeyboardEvent;
    expect(isAllowedNumericInputKey(controlEvent)).toBe(true);
    expect(isAllowedNumericInputKey(ctrlEvent)).toBe(true);
  });
});
