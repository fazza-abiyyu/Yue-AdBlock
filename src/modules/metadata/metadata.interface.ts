export interface RuleHash {
  name: string;
  hash: string;
  size: number;
}

export interface MetadataResponse {
  version: string;
  engineVersion: string;
  updatedAt: string;
  profiles: string[];
  rules: RuleHash[];
  features: {
    cookieBanner: boolean;
    webRtc: boolean;
    scriptlet: boolean;
    redirect: boolean;
  };
}
