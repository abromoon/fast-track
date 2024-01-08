export default function calculateDeposit(
  firstCurrency: string,
  firstPercent: number,
  exchange: number,
  secondCurrency: string,
  secondPercent: number
): string {
  const firstProfit = (1_000_000 * firstPercent) / 100 / 12
  const secondProfit = (1_000_000 * exchange * secondPercent) / 100 / 12;

  return firstProfit > secondProfit ? firstCurrency : secondCurrency;
}