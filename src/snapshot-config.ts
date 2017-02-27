import { Injectable } from '@angular/core';
import { assign } from 'lodash';

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
    return assign(SnapshotConfig.defaults(), config);
  }
}
