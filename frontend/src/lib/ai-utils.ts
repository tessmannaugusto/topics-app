import { UserConfig } from '../storage/topic-storage';

export interface ProviderRequestConfig {
  name: 'google' | 'openai' | 'anthropic';
  apiKey: string;
  model?: string;
}

export const getOrderedConfigs = (config: UserConfig): ProviderRequestConfig[] => {
  const configs: ProviderRequestConfig[] = [];
  
  // Start with the default provider
  const defaultProvider = config.defaultProvider;
  const defaultP = config.providers[defaultProvider];
  
  if (defaultP.apiKey) {
    configs.push({
      name: defaultProvider,
      apiKey: defaultP.apiKey,
      model: defaultP.model,
    });
  }
  
  // Add other providers in order
  const providers: ('google' | 'openai' | 'anthropic')[] = ['google', 'openai', 'anthropic'];
  
  for (const pName of providers) {
    if (pName !== defaultProvider) {
      const p = config.providers[pName];
      if (p.apiKey) {
        configs.push({
          name: pName,
          apiKey: p.apiKey,
          model: p.model,
        });
      }
    }
  }
  
  return configs;
};
