export function isoNowMinus(minutes: number) {
  return new Date(Date.now() - minutes * 60_000).toISOString();
}
export function isoNow() {
  return new Date().toISOString();
}
