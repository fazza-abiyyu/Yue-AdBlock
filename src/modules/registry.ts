import { buildHealthModule } from './health/index.js';
import { buildMetadataModule } from './metadata/index.js';
import { buildAdblockModule } from './adblock/index.js';

export type ModuleBuilder = (app: any) => any;

export const moduleBuilders: ModuleBuilder[] = [
  buildHealthModule,
  buildMetadataModule,
  buildAdblockModule,
];
