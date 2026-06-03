/**
 * Centralized environment configuration.
 * Exposing this configuration ensures type safety and allows for
 * fallback values in case environment variables are missing.
 */
export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'https://fakestoreapi.com',
};
