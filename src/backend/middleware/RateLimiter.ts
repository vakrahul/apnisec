export class RateLimiter {
  private static instance: RateLimiter;
  private requests: Map<string, { count: number; reset: number }> = new Map();

  private constructor() {} // Private to force Singleton usage

  public static getInstance(): RateLimiter {
    if (!RateLimiter.instance) RateLimiter.instance = new RateLimiter();
    return RateLimiter.instance;
  }

  public check(ip: string, limit = 100, windowMs = 900000) { // 15 mins default
    const now = Date.now();
    const record = this.requests.get(ip) || { count: 0, reset: now + windowMs };

    if (now > record.reset) {
      record.count = 1;
      record.reset = now + windowMs;
    } else {
      record.count++;
    }

    this.requests.set(ip, record);
    return { 
      allowed: record.count <= limit, 
      reset: record.reset 
    };
  }
}