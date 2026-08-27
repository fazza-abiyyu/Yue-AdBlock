export interface PolicyResponse {
  profile: string;
  name: string;
  description: string;
  version: string;
  updatedAt: string;
  engine: {
    version: string;
    minVersion: string;
    features: string[];
  };
  rules: {
    required: string[];
    optional: string[];
  };
  blocking: {
    level: 'allowlist' | 'standard' | 'aggressive';
    blockThirdParty: boolean;
    blockTracking: boolean;
    blockCookies: boolean;
  };
  cosmetic: {
    enabled: boolean;
    video: boolean;
    siteSpecific: boolean;
  };
  redirect: {
    skip: boolean;
    timeout: number;
  };
  webSocket: {
    blockTracking: boolean;
  };
  cookieBanner: {
    enabled: boolean;
  };
  scriptlet: {
    enabled: boolean;
  };
  antiAdblock: {
    enabled: boolean;
    bypass: boolean;
  };
  riskScoring: {
    enabled: boolean;
    threshold: number;
  };
}

export interface ProfileInfo {
  id: string;
  name: string;
  description: string;
  isDefault: boolean;
}
