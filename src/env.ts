import { ReflectiveInjector } from '@angular/core';

import './component-fixture';
import * as reporter from './reporter';
import * as runner from './runner';
import * as serializer from './serializer';
import * as snapshotFiles from './snapshot-files';
import * as fileSystemAdapter from './file-system-adapter';
import { SnapshotConfig } from './snapshot-config';


let injector: ReflectiveInjector;

export function initializeSnapshots(config: SnapshotConfig) {
  injector = ReflectiveInjector.resolveAndCreate([
    reporter.PROVIDERS,
    runner.PROVIDERS,
    serializer.PROVIDERS,
    snapshotFiles.PROVIDERS,
    fileSystemAdapter.PROVIDERS,
    { provide: SnapshotConfig, useValue: SnapshotConfig.withDefaults(config) }
  ]);
}


export function getRunner(): runner.SnapshotRunner {
  return injector.get(runner.SnapshotRunner);
}

export function getConfig(): SnapshotConfig {
  return injector.get(SnapshotConfig);
}
