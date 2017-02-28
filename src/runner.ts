import { Injectable } from '@angular/core';
import { merge } from 'lodash';
import { SnapshotConfig } from './snapshot-config';
import { SnapshotFileHandler } from './snapshot-files';
import { SnapshotReporter } from './reporter';
import { Snapshots } from './snapshots';
import { diffSnapshots } from './snapshot-differ';


@Injectable()
export class SnapshotRunner {
  private specCounter = 0;
  private specDescription: string;
  private encounteredSnapshots: Snapshots = {};
  private loadedSnapshots: Snapshots = {};
  private activeFilePath: string | null = null;

  constructor(
    private config: SnapshotConfig,
    private fileHandler: SnapshotFileHandler,
    private reporter: SnapshotReporter
  ) {
    reporter.specStarted$.subscribe(spec => this.setSpecDescription(spec));
  }

  private setSpecDescription(spec: any) {
    this.specDescription = spec.fullName;
    this.specCounter = 0;
  }

  private getCurrentSnapshot(): { found: boolean, snapshot?: string } {
    const notFound = { found: false };

    if (!Boolean(this.loadedSnapshots[this.specDescription])) {
      return notFound;
    }

    const specSnapshots = this.loadedSnapshots[this.specDescription];

    if (!Boolean(specSnapshots[this.specCounter])) {
      return notFound;
    }

    const currentSnapshot = specSnapshots[this.specCounter];

    return { found: true, snapshot: currentSnapshot };
  }

  private encounterSnapshot(snapshot: string) {
    if (this.config.failOnSnapshotDiscovery) {
      throw new Error(`Snapshot missing for "${this.specDescription}"`);
    }
    if (!Boolean(this.encounteredSnapshots[this.specDescription])) {
      this.encounteredSnapshots[this.specDescription] = {
        [this.specCounter]: snapshot
      };
    }
    else {
      this.encounteredSnapshots[this.specDescription][this.specCounter] = snapshot;
    }
  }

  loadSnapshots(file: string) {
    if (this.activeFilePath !== null) {
      throw new Error(`Previous snapshots have not been saved`);
    }

    this.loadedSnapshots = this.fileHandler.load(file);
    this.encounteredSnapshots = {};
    this.activeFilePath = file;
  }

  compareSnapshot(fixture: any): { pass: boolean, message?: string } {
    if (this.activeFilePath === null) {
      throw new Error(`No snapshots have been loaded`);
    }

    if (fixture.toJSON) {
      fixture = fixture.toJSON();
    }

    if (typeof fixture !== 'string') {
      fixture = JSON.stringify(fixture, null, 2);
    }

    const { found, snapshot } = this.getCurrentSnapshot();

    if (!found) {
      this.encounterSnapshot(fixture);
      ++this.specCounter;

      return { pass: true };
    }

    ++this.specCounter;
    return diffSnapshots(snapshot, fixture);
  }

  saveSnapshots() {
    const snapshots = merge({}, this.loadedSnapshots, this.encounteredSnapshots);

    this.fileHandler.save(this.activeFilePath, snapshots);

    this.activeFilePath = null;
  }
}


export const PROVIDERS = [
  SnapshotRunner
];
