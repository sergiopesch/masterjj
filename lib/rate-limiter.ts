import { createClient } from '@supabase/supabase-js'
import { Redis } from '@upstash/redis'

const RATE_LIMIT_ATTEMPTS = 5
const RATE_LIMIT_WINDOW = 60 * 15 // 15 minutes in seconds

// Initialize Redis client
const redis = Redis.fromEnv()

export class RateLimiter {
  private key: string

  constructor(identifier: string) {
    // Use IP or email as identifier
    this.key = `rate_limit:${identifier}`
  }

  async increment(): Promise<boolean> {
    const multi = redis.multi()
    
    // Increment the counter
    await multi.incr(this.key)
    
    // Set expiry if it doesn't exist
    await multi.expire(this.key, RATE_LIMIT_WINDOW)
    
    const [count] = await multi.exec()
    
    return (count as number) <= RATE_LIMIT_ATTEMPTS
  }

  async getRemainingAttempts(): Promise<number> {
    const count = await redis.get<number>(this.key) || 0
    return Math.max(0, RATE_LIMIT_ATTEMPTS - count)
  }

  async reset(): Promise<void> {
    await redis.del(this.key)
  }
}

export async function checkRateLimit(identifier: string): Promise<{ 
  allowed: boolean 
  remaining: number 
  resetIn?: number 
}> {
  const limiter = new RateLimiter(identifier)
  const allowed = await limiter.increment()
  const remaining = await limiter.getRemainingAttempts()

  return {
    allowed,
    remaining,
    resetIn: allowed ? undefined : RATE_LIMIT_WINDOW
  }
}
