/**
 * Twitter Anti-Muzzle Utilities
 * Prevent your X/Twitter bot from getting muzzled (write access revoked)
 *
 * Usage:
 *   import { AntiMuzzle, ContentVariation } from './antiMuzzle';
 *
 *   const antiMuzzle = new AntiMuzzle();
 *
 *   if (antiMuzzle.canReply(userId, isBot)) {
 *     await antiMuzzle.addHumanDelay();
 *     const result = await api.postTweet(text);
 *     antiMuzzle.recordReply(userId);
 *   }
 */

interface AntiMuzzleConfig {
  maxRepliesHuman?: number;
  maxRepliesBot?: number;
  replyWindowHours?: number;
  vipAccounts?: Set<string>;
}

interface TokenItem {
  symbol: string;
  price: string;
  change: string;
}

/**
 * Anti-muzzling utilities for X/Twitter bots
 */
export class AntiMuzzle {
  private maxRepliesHuman: number;
  private maxRepliesBot: number;
  private replyWindowMs: number;
  private vipAccounts: Set<string>;
  private userReplies: Map<string, Date[]>;

  constructor(config: AntiMuzzleConfig = {}) {
    this.maxRepliesHuman = config.maxRepliesHuman ?? 5;
    this.maxRepliesBot = config.maxRepliesBot ?? 1;
    this.replyWindowMs = (config.replyWindowHours ?? 1) * 60 * 60 * 1000;
    this.vipAccounts = config.vipAccounts ?? new Set();
    this.userReplies = new Map();
  }

  /**
   * Check if we can reply to this user without hitting rate limits
   */
  canReply(userId: string, isBot: boolean = false): boolean {
    // VIP bypass
    if (this.vipAccounts.has(userId)) {
      return true;
    }

    const now = new Date();
    const cutoff = new Date(now.getTime() - this.replyWindowMs);

    // Clean old entries and count recent replies
    const replies = this.userReplies.get(userId) ?? [];
    const recentReplies = replies.filter((date) => date > cutoff);
    this.userReplies.set(userId, recentReplies);

    const recentCount = recentReplies.length;
    const maxAllowed = isBot ? this.maxRepliesBot : this.maxRepliesHuman;
    const canReply = recentCount < maxAllowed;

    if (!canReply) {
      console.log(
        `Rate limit: ${userId} (${isBot ? "bot" : "human"}) - ${recentCount}/${maxAllowed}`
      );
    }

    return canReply;
  }

  /**
   * Record that we replied to this user
   */
  recordReply(userId: string): void {
    const replies = this.userReplies.get(userId) ?? [];
    replies.push(new Date());
    this.userReplies.set(userId, replies);
  }

  /**
   * Add human-like delay before posting (simulates reading + thinking + typing)
   */
  async addHumanDelay(
    minSeconds: number = 3.0,
    maxSeconds: number = 8.0
  ): Promise<void> {
    const delay = Math.random() * (maxSeconds - minSeconds) + minSeconds;
    console.log(`Human-like delay: ${delay.toFixed(2)}s`);
    await this.sleep(delay * 1000);
  }

  /**
   * Add delay between chained posts (multiple images/tweets)
   */
  async addChainDelay(
    minSeconds: number = 8.0,
    maxSeconds: number = 15.0
  ): Promise<void> {
    const delay = Math.random() * (maxSeconds - minSeconds) + minSeconds;
    console.log(`Chain post delay: ${delay.toFixed(2)}s`);
    await this.sleep(delay * 1000);
  }

  /**
   * Add user to VIP list (bypass rate limits)
   */
  addVip(userId: string): void {
    this.vipAccounts.add(userId);
    console.log(`Added VIP: ${userId}`);
  }

  /**
   * Remove user from VIP list
   */
  removeVip(userId: string): void {
    this.vipAccounts.delete(userId);
    console.log(`Removed VIP: ${userId}`);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

/**
 * Utilities for varying response content to avoid repetitive patterns
 */
export class ContentVariation {
  /**
   * Add varied introduction to responses
   */
  static varyIntro(baseText: string): string {
    const intros = [
      "Here's what I found:",
      "Check these out:",
      "Here you go:",
      "Found these:",
      "Take a look:",
      "", // Sometimes no intro
    ];

    const intro = intros[Math.floor(Math.random() * intros.length)];
    return intro ? `${intro}\n\n${baseText}` : baseText;
  }

  /**
   * Format a list with varied structure
   */
  static varyListFormat(items: TokenItem[]): string {
    const formats = [
      (i: TokenItem) => `• ${i.symbol} - $${i.price} (${i.change})`,
      (i: TokenItem) => `${i.symbol}: $${i.price} | ${i.change}`,
      (i: TokenItem) => `$${i.symbol} ${i.price} ${i.change}`,
      (i: TokenItem) => `${i.symbol} ${i.price} · ${i.change}`,
    ];

    const formatter = formats[Math.floor(Math.random() * formats.length)];
    return items.map(formatter).join("\n");
  }

  /**
   * Return varied emoji selection
   */
  static varyEmojis(baseEmojis: string[]): string[] {
    const count = Math.floor(Math.random() * Math.min(3, baseEmojis.length + 1));

    if (count === 0) return [];

    // Fisher-Yates shuffle and take first N
    const shuffled = [...baseEmojis];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled.slice(0, count);
  }
}

/**
 * Decorator to monitor 403 Forbidden errors (early muzzling warning)
 */
export function monitor403Errors<T extends (...args: any[]) => Promise<any>>(
  target: any,
  propertyName: string,
  descriptor: TypedPropertyDescriptor<T>
) {
  const originalMethod = descriptor.value!;

  descriptor.value = async function (...args: any[]) {
    try {
      return await originalMethod.apply(this, args);
    } catch (error: any) {
      // Check for 403 Forbidden
      if (
        error?.message?.includes("403") ||
        error?.message?.includes("Forbidden")
      ) {
        console.error(`403 Forbidden detected: ${error.message}`);

        // Check if potentially muzzled
        if (
          error?.message?.toLowerCase().includes("muzzled") ||
          error?.message?.toLowerCase().includes("write")
        ) {
          console.error(
            "⚠️ MUZZLING DETECTED! Check X developer portal immediately."
          );
        }
      }

      throw error;
    }
  } as T;

  return descriptor;
}

// Example usage
if (require.main === module) {
  (async () => {
    // Initialize
    const antiMuzzle = new AntiMuzzle({
      maxRepliesHuman: 5,
      maxRepliesBot: 1,
      vipAccounts: new Set(["123456789"]), // VIP user IDs
    });

    const userId = "987654321";
    const isBot = false;

    // Check if we can reply
    if (antiMuzzle.canReply(userId, isBot)) {
      console.log(`✅ Can reply to ${userId}`);

      // Add human-like delay
      console.log("Adding human-like delay...");
      await antiMuzzle.addHumanDelay();

      // Simulate posting
      console.log("Posting tweet...");
      // await api.postTweet(text);

      // Record the reply
      antiMuzzle.recordReply(userId);
      console.log("Reply recorded");
    } else {
      console.log(`❌ Rate limited for ${userId}`);
    }

    // Content variation example
    const items: TokenItem[] = [
      { symbol: "BTC", price: "45000", change: "+5%" },
      { symbol: "ETH", price: "2500", change: "+3%" },
    ];

    const variedContent = ContentVariation.varyListFormat(items);
    console.log(`\nVaried content:\n${variedContent}`);
  })();
}
