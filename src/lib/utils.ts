export function formatPrice(amount: number, currencyCode = "NGN", locale?: string): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currencyCode,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currencyCode} ${amount.toLocaleString()}`;
  }
}

export function formatDate(value: string, locale?: string): string {
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(new Date(value));
}
