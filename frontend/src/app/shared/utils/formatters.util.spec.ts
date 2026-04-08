import { formatCurrencyBRL, formatDateTimeBR } from './formatters.util';

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
});
