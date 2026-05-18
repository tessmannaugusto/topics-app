import { ProviderRequestConfig } from './types';

export const normalizeConfigs = (
  configs?: ProviderRequestConfig[],
  apiKey?: string,
  model?: string
): ProviderRequestConfig[] => {
  if (configs && configs.length > 0) {
    return configs;
  }

  if (apiKey) {
    return [{
      name: 'google', // Default to google for backward compatibility
      apiKey,
      model
    }];
  }

  return [];
};
