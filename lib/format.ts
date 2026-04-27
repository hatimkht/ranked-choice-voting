/** Lokalisierte Formatierer für deutsche Anzeige. */

const numberFormatter = new Intl.NumberFormat("de-DE");

export function formatNumber(value: number): string {
  return numberFormatter.format(Math.round(value));
}

export function formatPercent(value: number, fractionDigits = 1): string {
  return `${value.toLocaleString("de-DE", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })} %`;
}
