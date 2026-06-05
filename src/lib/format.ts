export function formatPrice(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
}

export function savingsText(price: number, original: number) {
  const savings = Math.max(original - price, 0);
  const percent = original > 0 ? Math.round((savings / original) * 100) : 0;

  return `${formatPrice(savings)} saved, which is basically financial wizardry (${percent}% off)`;
}
