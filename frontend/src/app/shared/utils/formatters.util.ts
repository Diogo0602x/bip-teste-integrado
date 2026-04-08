export function formatCurrencyBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value ?? 0);
}

export function formatDateTimeBR(value: string): string {
  return new Date(value).toLocaleString('pt-BR');
}
