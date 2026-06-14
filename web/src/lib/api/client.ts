import { tokenStore } from '../auth/tokenStore';

// Client HTTP minimal basé sur fetch natif (pas de librairie externe).
// Ajoute automatiquement le jeton Bearer s'il est présent dans le tokenStore.
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000/api/v1';

interface ApiSuccess<T> {
  success: true;
  data: T;
}

interface ApiFailure {
  success: false;
  error: { message: string; code?: string; details?: unknown };
}

type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

export class ApiClientError extends Error {
  readonly status: number;
  readonly code: string | undefined;
  readonly details: unknown;

  constructor(
    status: number,
    message: string,
    code?: string,
    details?: unknown,
  ) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const token = tokenStore.get();

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'content-type': 'application/json',
      ...(token ? { authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {}),
    },
  });

  const payload = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !payload.success) {
    const message = !payload.success
      ? payload.error.message
      : response.statusText;
    const code = !payload.success ? payload.error.code : undefined;
    const details = !payload.success ? payload.error.details : undefined;
    throw new ApiClientError(response.status, message, code, details);
  }

  return payload.data;
}
