export function formatInr(value: number) {
  return `INR ${value.toLocaleString('en-IN')}`;
}

export function discountedPrice(price: number, discountPercent: number) {
  return Math.max(price - Math.round((price * discountPercent) / 100), 0);
}
