/**
 * Configuração da aplicação (desenvolvimento).
 * Para produção, use fileReplacements no `angular.json` ou injeção em runtime.
 */
export const environment = {
  production: false,
  /** Origem do backend + prefixo versionado da API REST */
  apiBaseUrl: 'http://localhost:8080/api/v1'
} as const;
