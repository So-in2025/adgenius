// Cache simple en memoria para el MVP
const cache = new Map();

export async function getFromCache(key: string): Promise<any> {
  return cache.get(key);
}

export async function setToCache(key: string, value: any, ttl: number = 60 * 60 * 24): Promise<void> {
  cache.set(key, value);
  // Limpieza automática después del TTL
  setTimeout(() => cache.delete(key), ttl * 1000);
}