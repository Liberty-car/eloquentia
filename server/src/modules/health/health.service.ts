export interface HealthStatus {
  status: 'ok';
  uptime: number;
  timestamp: string;
}

// Logique métier du health check (sans accès base de données).
export function getHealthStatus(): HealthStatus {
  return {
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  };
}
