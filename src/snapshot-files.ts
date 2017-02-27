import { Injectable } from '@angular/core';
import { SnapshotConfig } from './snapshot-config';
import { FileSystemAdapter } from './file-system-adapter';
import { Snapshots } from './snapshots';
import { YamlSerializer } from './serializer';


@Injectable()
export class SnapshotFileHandler {
  constructor(
    private config: SnapshotConfig,
    private fileSystem: FileSystemAdapter,
    private yaml: YamlSerializer
  ) { }

  save(path: string, snapshots: Snapshots) {
    this.fileSystem.saveFile(path, this.yaml.serialize(snapshots));
  }

  load(path: string): Snapshots {
    if (this.config.discardOldSnapshots || !this.fileSystem.fileExists(path)) {
      return {};
    }

    const content = this.fileSystem.loadFile(path);

    return this.yaml.parse(content);
  }
}


export const PROVIDERS = [
  SnapshotFileHandler
];
