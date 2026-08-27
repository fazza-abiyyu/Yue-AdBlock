export interface MetadataInfo {
  service: string;
  version: string;
  description: string;
  endpoints: EndpointInfo[];
}

export interface EndpointInfo {
  method: string;
  path: string;
  description: string;
}
