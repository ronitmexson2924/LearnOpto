import { GoogleGenAI } from "@google/genai";

class GeminiKeyManager {
  private keys: string[] = [];
  private currentIndex: number = 0;

  constructor() {
    this.reloadKeys();
  }

  /**
   * Parse API keys from process.env.
   * Supports:
   * 1. GEMINI_API_KEYS="key1,key2,key3,..."
   * 2. GEMINI_API_KEY_1, GEMINI_API_KEY_2, ... GEMINI_API_KEY_10
   * 3. GEMINI_API_KEY (single fallback key)
   */
  public reloadKeys(): void {
    const rawKeys: string[] = [];

    // Check GEMINI_API_KEYS (comma separated)
    if (process.env.GEMINI_API_KEYS) {
      const splitKeys = process.env.GEMINI_API_KEYS.split(",").map((k) => k.trim());
      rawKeys.push(...splitKeys);
    }

    // Check numbered keys GEMINI_API_KEY_1 ... GEMINI_API_KEY_10
    for (let i = 1; i <= 10; i++) {
      const key = process.env[`GEMINI_API_KEY_${i}`];
      if (key && key.trim()) {
        rawKeys.push(key.trim());
      }
    }

    // Check fallback single GEMINI_API_KEY
    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim()) {
      rawKeys.push(process.env.GEMINI_API_KEY.trim());
    }

    // Deduplicate and filter non-empty keys
    this.keys = Array.from(new Set(rawKeys.filter((k) => k.length > 0)));

    if (this.keys.length === 0) {
      console.warn("⚠️ [GeminiKeyManager] Warning: No GEMINI_API_KEY configured in environment variables!");
    } else {
      console.log(`✅ [GeminiKeyManager] Initialized with ${this.keys.length} API key(s) in rotation pool.`);
    }
  }

  /**
   * Get total number of configured keys
   */
  public getKeyCount(): number {
    return this.keys.length;
  }

  /**
   * Get currently active key index (1-based for human logging)
   */
  public getCurrentKeyInfo(): { index: number; total: number } {
    return {
      index: this.currentIndex + 1,
      total: this.keys.length,
    };
  }

  /**
   * Execute content generation with automatic failover across all configured API keys.
   */
  public async generateContent(
    prompt: string,
    modelName: string = "gemini-2.5-flash"
  ): Promise<any> {
    if (this.keys.length === 0) {
      throw new Error("No Gemini API keys configured on server.");
    }

    const attemptsCount = this.keys.length;
    let lastError: any = null;

    for (let attempt = 0; attempt < attemptsCount; attempt++) {
      const keyIndex = (this.currentIndex + attempt) % this.keys.length;
      const apiKey = this.keys[keyIndex];

      try {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
          model: modelName,
          contents: prompt,
        });

        // On success, advance current index for round-robin load distribution
        this.currentIndex = (keyIndex + 1) % this.keys.length;
        return response;
      } catch (err: any) {
        lastError = err;
        console.warn(
          `⚠️ [GeminiKeyManager] Key ${keyIndex + 1}/${this.keys.length} encountered an error: ${
            err?.message || err
          }. Failing over to key ${(keyIndex + 1) % this.keys.length + 1}...`
        );
      }
    }

    console.error(`❌ [GeminiKeyManager] All ${attemptsCount} API keys failed.`);
    throw lastError || new Error("All configured Gemini API keys failed.");
  }
}

// Singleton Instance
export const geminiKeyManager = new GeminiKeyManager();
