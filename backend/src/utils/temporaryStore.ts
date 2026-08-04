type StoredValue<T> = {
  expiresAt: number;
  value: T;
};

export class TemporaryStore<T> {
  private readonly values = new Map<string, StoredValue<T>>();

  set(key: string, value: T, ttlMs: number): void {
    this.cleanup();
    this.values.set(key, {
      value,
      expiresAt: Date.now() + ttlMs,
    });
  }

  consume(key: string): T | null {
    const entry = this.values.get(key);
    this.values.delete(key);

    if (!entry || entry.expiresAt < Date.now()) {
      return null;
    }

    return entry.value;
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.values.entries()) {
      if (entry.expiresAt < now) {
        this.values.delete(key);
      }
    }
  }
}
