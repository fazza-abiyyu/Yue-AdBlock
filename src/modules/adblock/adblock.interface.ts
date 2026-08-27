export interface AdblockPolicy {
  policyVersion: number;
  engineVersion: number;
  profile: string;
  network: {
    mode: string;
    thirdParty: {
      blockTrackers: boolean;
      blockAds: boolean;
      blockMalvertising: boolean;
    };
    firstParty: { enabled: boolean };
    unknown: { action: string };
  };
  navigation: {
    popup: { policy: string };
    redirect: {
      maxChain: number;
      thirdParty: string;
      sameSite: string;
      userGestureRequired: boolean;
      allowOAuth: boolean;
    };
  };
  cosmetic: {
    enabled: boolean;
    strategy: string;
    generic: { maxRules: number };
    iframe: { enabled: boolean };
  };
  cookieBanner: { enabled: boolean; maxRules: number };
  webSocket: { blockTracking: boolean; blockAnalytics: boolean };
  scriptlet: { enabled: boolean };
  youtube: { enabled: boolean; strategy: string; skipHosts: string[] };
  antiAdblock: { enabled: boolean };
  riskScoring: {
    blockThreshold: number;
    warnThreshold: number;
    signalScores: Record<string, number>;
  };
}

export interface RuleMetadata {
  adDomains: RuleFileInfo;
  abpindo: RuleFileInfo;
  easylist: RuleFileInfo;
  cosmeticSelectors: RuleFileInfo;
  dangerousElements: RuleFileInfo;
  gamblingModerate: RuleFileInfo;
  gamblingStrict: RuleFileInfo;
}

export interface RuleFileInfo {
  version: number;
  hash: string;
}

export interface StrategyMetadata {
  latestPolicyVersion: number;
  minEngineVersion: number;
  lastUpdated: string;
  rules: RuleMetadata;
  availableProfiles: string[];
}

export interface SyncResult {
  success: boolean;
  policyVersion?: number;
  rulesDownloaded?: boolean;
  message?: string;
}
