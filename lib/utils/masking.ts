export function maskAccountNumber(accNo?: string): string {
  if (!accNo || accNo.length < 4) return 'XXXX-XXXX-XXXX';
  const lastFour = accNo.slice(-4);
  return `XXXX-XXXX-${lastFour}`;
}

export function maskTaxId(taxId?: string): string {
  if (!taxId || taxId.length < 5) return 'XXXXX-XXXX';
  const prefix = taxId.slice(0, 2);
  const suffix = taxId.slice(-2);
  return `${prefix}XXXXXX${suffix}`;
}
