export function rollDice(): number {
  return Math.ceil(Math.random() * 6);
}

export function randomChoice<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)]!;
}
