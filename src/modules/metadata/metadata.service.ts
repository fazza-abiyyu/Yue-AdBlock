import type { MetadataInfo } from './metadata.interface';

export class MetadataService {
  getMetadata(): MetadataInfo {
    return {
      service: 'yue-adblock',
      version: '1.0.0',
      description: 'Remote adblock policy & filter rule server for Yue Browser',
      endpoints: [
        { method: 'GET', path: '/health', description: 'Health check' },
        {
          method: 'GET',
          path: '/metadata',
          description: 'Full adblock metadata (policy version, rule hashes, profiles)',
        },
        {
          method: 'GET',
          path: '/policy?profile={name}',
          description: 'Get adblock policy for a profile',
        },
        { method: 'GET', path: '/profiles', description: 'List available policy profiles' },
        { method: 'GET', path: '/rules/{name}', description: 'Download a rule file (plain text)' },
      ],
    };
  }
}

export const metadataService = new MetadataService();
