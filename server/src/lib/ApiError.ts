interface ApiErrorOptions {
  code?: string;
  details?: unknown;
}

// Erreur applicative normalisée. Le middleware errorHandler la transforme
// en réponse JSON cohérente. Les controllers/services peuvent la lever
// directement (Express 5 propage les erreurs vers errorHandler).
export class ApiError extends Error {
  readonly statusCode: number;
  readonly code: string | undefined;
  readonly details: unknown;

  constructor(
    statusCode: number,
    message: string,
    options: ApiErrorOptions = {},
  ) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = options.code;
    this.details = options.details;
    Error.captureStackTrace?.(this, ApiError);
  }

  static badRequest(
    message = 'Requête invalide',
    options?: ApiErrorOptions,
  ): ApiError {
    return new ApiError(400, message, options);
  }

  static unauthorized(
    message = 'Authentification requise',
    options?: ApiErrorOptions,
  ): ApiError {
    return new ApiError(401, message, options);
  }

  static forbidden(
    message = 'Accès refusé',
    options?: ApiErrorOptions,
  ): ApiError {
    return new ApiError(403, message, options);
  }

  static notFound(
    message = 'Ressource introuvable',
    options?: ApiErrorOptions,
  ): ApiError {
    return new ApiError(404, message, options);
  }

  static internal(
    message = 'Erreur interne du serveur',
    options?: ApiErrorOptions,
  ): ApiError {
    return new ApiError(500, message, options);
  }
}
