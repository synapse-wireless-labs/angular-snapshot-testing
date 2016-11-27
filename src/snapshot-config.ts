import { Injectable } from '@angular/core';

@Injectable()
export abstract class SnapshotConfig {
  fileExtension?: string;
  failOnSnapshotDiscovery?: boolean;
  discardOldSnapshots?: boolean;

  static defaults(): SnapshotConfig {
    return {
      fileExtension: 'snap',
      failOnSnapshotDiscovery: false,
      discardOldSnapshots: false
    };
  }

  static withDefaults(config: SnapshotConfig): SnapshotConfig {
    return Object.assign(SnapshotConfig.defaults(), config);
  }
}