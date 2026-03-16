export function unixToDate(timestamp: number) {
  return new Date(timestamp * 1000);
}
