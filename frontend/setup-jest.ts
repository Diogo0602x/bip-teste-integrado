import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';
import '@testing-library/jest-dom';

setupZoneTestEnv();

if (!globalThis.crypto) {
  Object.defineProperty(globalThis, 'crypto', {
    value: {},
    configurable: true
  });
}

if (!globalThis.crypto.randomUUID) {
  Object.defineProperty(globalThis.crypto, 'randomUUID', {
    value: () => '123e4567-e89b-12d3-a456-426614174000',
    configurable: true
  });
}
