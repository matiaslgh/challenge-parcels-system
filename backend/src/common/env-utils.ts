export enum Environment {
  Dev = 'development',
  Prod = 'production',
  Test = 'test',
}

export function getEnvironment(): Environment {
  const env = process.env.NODE_ENV;

  if (!env || env === 'development') {
    return Environment.Dev;
  }

  if (env === 'production') {
    return Environment.Prod;
  }

  if (env === 'test') {
    return Environment.Test;
  }

  throw new Error(`Invalid NODE_ENV: ${env}`);
}

export function isProd(): boolean {
  return getEnvironment() === Environment.Prod;
}

export function isDev(): boolean {
  return getEnvironment() === Environment.Dev;
}

export function isTest(): boolean {
  return getEnvironment() === Environment.Test;
}
