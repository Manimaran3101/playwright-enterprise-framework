import 'dotenv/config';

/**
 * Single source of truth for environment-specific settings.
 * Pick a preset with TEST_ENV; BASE_URL / API_URL override the preset.
 */
const presets = {
  prod: {
    baseUrl: 'https://practicesoftwaretesting.com',
    apiUrl: 'https://api.practicesoftwaretesting.com',
  },
  // The project publishes a "with bugs" build, handy for demoing failing checks.
  'with-bugs': {
    baseUrl: 'https://with-bugs.practicesoftwaretesting.com',
    apiUrl: 'https://api-with-bugs.practicesoftwaretesting.com',
  },
  local: {
    baseUrl: 'http://localhost:4200',
    apiUrl: 'http://localhost:8091',
  },
} as const;

export type EnvName = keyof typeof presets;

function resolveEnvName(): EnvName {
  const name = process.env.TEST_ENV ?? 'prod';
  if (!(name in presets)) {
    throw new Error(
      `Unknown TEST_ENV "${name}". Expected one of: ${Object.keys(presets).join(', ')}`,
    );
  }
  return name as EnvName;
}

const envName = resolveEnvName();

export const env = {
  name: envName,
  baseUrl: process.env.BASE_URL ?? presets[envName].baseUrl,
  apiUrl: process.env.API_URL ?? presets[envName].apiUrl,
  isCI: !!process.env.CI,
  apiTimeout: Number(process.env.API_TIMEOUT_MS ?? 30_000),
  customer: {
    email: process.env.CUSTOMER_EMAIL ?? 'customer@practicesoftwaretesting.com',
    password: process.env.CUSTOMER_PASSWORD ?? 'welcome01',
  },
} as const;
