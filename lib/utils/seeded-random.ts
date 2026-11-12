/** Deterministic PRNG utilities. Same seed + same text always yields the same rewrite. */

export function hashString(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function random() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function createRng(seed: number) {
  const random = mulberry32(seed);
  return {
    next: random,
    chance(probability: number): boolean {
      return random() < probability;
    },
    pick<T>(items: readonly T[]): T {
      return items[Math.floor(random() * items.length)]!;
    },
    int(min: number, max: number): number {
      return Math.floor(random() * (max - min + 1)) + min;
    },
  };
}

export type Rng = ReturnType<typeof createRng>;
