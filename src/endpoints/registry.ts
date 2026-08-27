import { AdblockController } from '../modules/adblock/adblock.controller';
import { HealthController } from '../modules/health/health.controller';
import { MetadataController } from '../modules/metadata/metadata.controller';

export const controllers = [
  new HealthController(),
  new MetadataController(),
  new AdblockController(),
];
