# Redis Setup Guide

Kompletny przewodnik konfiguracji Redis dla aplikacji Next.js Blog z obsługą cache'owania, rate limiting i zarządzania sesjami.

## 📋 Spis treści

- [Wymagania](#wymagania)
- [Instalacja zależności](#instalacja-zależności)
- [Konfiguracja środowiska](#konfiguracja-środowiska)
- [Opcje wdrożenia](#opcje-wdrożenia)
- [Konfiguracja aplikacji](#konfiguracja-aplikacji)
- [Użycie](#użycie)
- [Monitoring i debugowanie](#monitoring-i-debugowanie)
- [Rozwiązywanie problemów](#rozwiązywanie-problemów)

## 🔧 Wymagania

- Node.js 18+
- Next.js 14+
- Redis server lub Upstash account
- TypeScript

## 📦 Instalacja zależności

Zależności zostały już dodane do `package.json`. Uruchom:

```bash
pnpm install
```

### Zainstalowane pakiety:

- `@upstash/redis` - Serverless Redis client
- `@upstash/ratelimit` - Rate limiting z Redis
- `ioredis` - Tradycyjny Redis client (backup)

## ⚙️ Konfiguracja środowiska

### Opcja 1: Upstash Redis (Zalecane dla Vercel/Serverless)

1. Utwórz konto na [Upstash](https://upstash.com/)
2. Stwórz nową bazę Redis
3. Dodaj do `.env.local`:

```env
# Upstash Redis
UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-redis-token

# Opcjonalne ustawienia - ZWIĘKSZONE LIMITY
REDIS_DEFAULT_TTL=3600
REDIS_KEY_PREFIX=blog:
REDIS_RATE_LIMIT_ENABLED=true
REDIS_RATE_LIMIT_MAX=2000  # Zwiększono z 100 do 2000
REDIS_RATE_LIMIT_WINDOW=60000
REDIS_SESSION_TTL=86400
REDIS_MONITORING_ENABLED=true
```

### Opcja 2: Tradycyjny Redis

#### Lokalne środowisko (Docker)

```bash
# Uruchom Redis w Docker
docker run -d --name redis-blog -p 6379:6379 redis:7-alpine

# Lub z Docker Compose
cat > docker-compose.redis.yml << EOF
version: '3.8'
services:
  redis:
    image: redis:7-alpine
    container_name: redis-blog
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    command: redis-server --appendonly yes
volumes:
  redis_data:
EOF

docker-compose -f docker-compose.redis.yml up -d
```

#### Konfiguracja środowiska

```env
# Tradycyjny Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your-password  # opcjonalne
REDIS_DB=0

# Lub pełny URL
REDIS_URL=redis://username:password@host:port/db

# Opcjonalne ustawienia
REDIS_DEFAULT_TTL=3600
REDIS_KEY_PREFIX=blog:
REDIS_RATE_LIMIT_ENABLED=true
REDIS_MONITORING_ENABLED=true
```

## 🚀 Opcje wdrożenia

### Vercel (Zalecane: Upstash)

1. Połącz projekt z Vercel
2. Dodaj zmienne środowiskowe w Vercel Dashboard
3. Wdróż aplikację

### Railway

```bash
# Dodaj Redis service
railway add redis

# Zmienne środowiskowe zostaną automatycznie ustawione
```

### DigitalOcean App Platform

1. Dodaj Redis Managed Database
2. Skonfiguruj zmienne środowiskowe
3. Wdróż aplikację

### AWS/Azure/GCP

Użyj zarządzanych usług Redis:
- AWS ElastiCache
- Azure Cache for Redis  
- Google Cloud Memorystore

## 🔧 Konfiguracja aplikacji

### Struktura plików Redis

```
lib/redis/
├── config.ts          # Konfiguracja i walidacja
├── client.ts          # Uniwersalny klient Redis
├── cache.ts           # System cache'owania
├── rate-limiter.ts    # Rate limiting
├── session.ts         # Zarządzanie sesjami
└── index.ts           # Główny eksport
```

### Integracja z middleware

Zaktualizuj `middleware.ts`:

```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { checkIPRateLimit } from '@/lib/redis'

export async function middleware(request: NextRequest) {
  // Rate limiting
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
  const rateLimitResult = await checkIPRateLimit(ip)
  
  if (!rateLimitResult.success) {
    return new NextResponse('Rate limit exceeded', {
      status: 429,
      headers: {
        'Retry-After': String(rateLimitResult.retryAfter || 60),
        'X-RateLimit-Limit': String(rateLimitResult.limit),
        'X-RateLimit-Remaining': String(rateLimitResult.remaining),
        'X-RateLimit-Reset': String(rateLimitResult.reset)
      }
    })
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/api/:path*',
    '/admin/:path*'
  ]
}
```

## 💻 Użycie

### Podstawowe operacje Redis

```typescript
import { redis } from '@/lib/redis'

// Zapisz z TTL
await redis.set('user:123', JSON.stringify(userData), 3600)

// Odczytaj
const userData = await redis.get('user:123')

// Zwiększ licznik
const views = await redis.incr('post:views:456')
```

### Cache'owanie

```typescript
import { getCache, cache } from '@/lib/redis'

const cacheService = getCache()

// Cache z automatycznym odświeżaniem
const posts = await cacheService.getOrSet(
  cache.posts.list(1, 10).key,
  async () => {
    return await db.posts.findMany({ take: 10 })
  },
  { 
    ttl: cache.posts.list().ttl,
    tags: ['posts'] 
  }
)

// Invalidacja cache
await cacheService.invalidateByTags(['posts'])
```

### Rate Limiting

```typescript
import { checkUserRateLimit, checkAuthRateLimit } from '@/lib/redis'

// API rate limiting
const result = await checkUserRateLimit(userId, 'api')
if (!result.success) {
  throw new Error('Rate limit exceeded')
}

// Auth rate limiting
const authResult = await checkAuthRateLimit(ip)
if (!authResult.success) {
  throw new Error('Too many login attempts')
}
```

### Zarządzanie sesjami

```typescript
import { createUserSession, getUserSession } from '@/lib/redis'

// Utwórz sesję z refresh tokenem
const session = await createUserSession(userId, {
  email: user.email,
  role: user.role
}, {
  refreshable: true,
  maxSessions: 5
})

// Pobierz dane sesji
const sessionData = await getUserSession(sessionId)
```

## 📊 Monitoring i debugowanie

### Health Check Endpoint

Sprawdź status Redis:

```bash
curl http://localhost:3000/api/redis/health
```

Odpowiedź:

```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 3600,
  "responseTime": 45,
  "services": {
    "redis": {
      "status": "healthy",
      "latency": 12
    },
    "cache": {
      "status": "healthy",
      "stats": {
        "hits": 150,
        "misses": 25,
        "hitRate": 0.857
      }
    },
    "sessions": {
      "status": "healthy",
      "stats": {
        "totalActiveSessions": 42
      }
    },
    "rateLimiter": {
      "status": "healthy",
      "info": {
        "limiters": ["global", "api", "auth"]
      }
    }
  }
}
```

### Logi i metryki

```typescript
import { getRedisService } from '@/lib/redis'

const redisService = getRedisService()

// Sprawdź health wszystkich serwisów
const health = await redisService.healthCheck()
console.log('Redis Health:', health)

// Statystyki cache
const cacheStats = redisService.cache.getStats()
console.log('Cache Stats:', cacheStats)
```

### Redis CLI (dla tradycyjnego Redis)

```bash
# Połącz się z Redis
redis-cli -h localhost -p 6379

# Sprawdź klucze
KEYS blog:*

# Sprawdź TTL
TTL blog:posts:list:1:10

# Sprawdź pamięć
INFO memory

# Sprawdź statystyki
INFO stats
```

## 🔧 Rozwiązywanie problemów

### Problem: Błąd połączenia z Redis

**Rozwiązanie:**

1. Sprawdź zmienne środowiskowe
2. Zweryfikuj dostępność Redis
3. Sprawdź logi aplikacji

```bash
# Sprawdź status Redis (Docker)
docker ps | grep redis

# Sprawdź logi Redis
docker logs redis-blog

# Test połączenia
curl http://localhost:3000/api/redis/health
```

### Problem: ERR_TOO_MANY_REDIRECTS podczas logowania

**Symptomy:** Nieskończona pętla redirectów, błąd "localhost redirected you too many times"

**Przyczyna:** Zbyt restrykcyjny rate limiting blokuje żądania logowania

**Rozwiązanie:**

1. **Zwiększ limity rate limiting w zmiennych środowiskowych:**
   ```env
   REDIS_RATE_LIMIT_MAX=2000  # zamiast 100
   REDIS_RATE_LIMIT_WINDOW=60000
   ```

2. **Wyczyść cookies przeglądarki** dla localhost

3. **W środowisku deweloperskim** ustaw:
   ```env
   NODE_ENV=development  # Wyłącza rate limiting
   ```

4. **Zrestartuj serwer deweloperski:**
   ```bash
   pnpm dev
   ```

### Problem: Rate limiting nie działa

**Rozwiązanie:**

1. Sprawdź konfigurację middleware
2. Zweryfikuj zmienne środowiskowe
3. Sprawdź logi rate limitera

```typescript
// Debug rate limiting
import { getRateLimiter } from '@/lib/redis'

const limiter = getRateLimiter()
console.log('Available limiters:', limiter.getLimiterNames())
console.log('Strategies:', limiter.getStrategies())
```

### Problem: Cache nie działa

**Rozwiązanie:**

1. Sprawdź TTL konfigurację
2. Zweryfikuj klucze cache
3. Sprawdź statystyki

```typescript
// Debug cache
import { getCache } from '@/lib/redis'

const cache = getCache()
const stats = cache.getStats()
console.log('Cache stats:', stats)

// Sprawdź konkretny klucz
const exists = await cache.exists('blog:posts:list:1:10')
console.log('Key exists:', exists)
```

### Problem: Sesje wygasają zbyt szybko

**Rozwiązanie:**

1. Sprawdź `REDIS_SESSION_TTL`
2. Zweryfikuj konfigurację cookies
3. Sprawdź session cleanup

```typescript
// Debug sessions
import { getSessionManager } from '@/lib/redis'

const sessionManager = getSessionManager()
const stats = await sessionManager.getSessionStats()
console.log('Session stats:', stats)
```

## 🔒 Bezpieczeństwo

### Produkcyjne ustawienia

```env
# Bezpieczne ustawienia produkcyjne
REDIS_PASSWORD=strong-password-here
REDIS_KEY_PREFIX=prod:blog:
REDIS_RATE_LIMIT_ENABLED=true
REDIS_MONITORING_ENABLED=false  # Wyłącz verbose logi
```

### Sieciowe zabezpieczenia

1. Użyj VPC/prywatnych sieci
2. Skonfiguruj firewall rules
3. Włącz SSL/TLS dla Redis
4. Regularnie aktualizuj hasła

### Backup i odzyskiwanie

```bash
# Backup Redis (tradycyjny)
redis-cli --rdb backup.rdb

# Restore
redis-cli --pipe < backup.rdb
```

## 📈 Optymalizacja wydajności

### Konfiguracja Redis

```conf
# redis.conf
maxmemory 256mb
maxmemory-policy allkeys-lru
save 900 1
save 300 10
save 60 10000
```

### Monitoring wydajności

```typescript
// Monitoruj latencję
import { checkRedisHealth } from '@/lib/redis'

setInterval(async () => {
  const health = await checkRedisHealth()
  if (health.latency && health.latency > 100) {
    console.warn('High Redis latency:', health.latency)
  }
}, 60000)
```

## 🚨 Natychmiastowe rozwiązanie problemu z logowaniem

Jeśli masz problem **ERR_TOO_MANY_REDIRECTS** podczas logowania:

1. **Dodaj do pliku `.env.local`:**
   ```env
   NODE_ENV=development
   REDIS_RATE_LIMIT_MAX=2000
   ```

2. **Wyczyść cookies w przeglądarce:**
   - Chrome: F12 → Application → Storage → Clear site data
   - Firefox: F12 → Storage → Cookies → Clear All

3. **Zrestartuj serwer Next.js:**
   ```bash
   # Zatrzymaj serwer (Ctrl+C)
   pnpm dev
   ```

4. **Sprawdź czy middleware działa poprawnie:**
   ```bash
   curl -v http://localhost:3000/admin/login
   ```

## 🎯 Następne kroki

1. **Skonfiguruj monitoring** - Dodaj Grafana/Prometheus
2. **Zaimplementuj alerting** - Powiadomienia o problemach
3. **Optymalizuj cache** - Dostosuj TTL do potrzeb
4. **Skonfiguruj backup** - Automatyczne kopie zapasowe
5. **Load testing** - Przetestuj pod obciążeniem

## 📚 Dodatkowe zasoby

- [Redis Documentation](https://redis.io/documentation)
- [Upstash Documentation](https://docs.upstash.com/)
- [Next.js Caching Guide](https://nextjs.org/docs/app/building-your-application/caching)
- [Rate Limiting Best Practices](https://blog.upstash.com/rate-limiting)

---

**Uwaga:** Pamiętaj o regularnym aktualizowaniu zależności i monitorowaniu bezpieczeństwa Redis w środowisku produkcyjnym. 