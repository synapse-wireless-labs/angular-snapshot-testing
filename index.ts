import * as path from 'path';
import * as mkdirp from 'mkdirp';
import './src/component-fixture';
import { installSnapshotMatcher } from './src/matcher';
import { initializeSnapshots, getRunner, getConfig } from './src/env';


jasmine.getEnv().beforeAll(installSnapshotMatcher);

declare global {
  namespace jasmine {
    interface Matchers {
      toMatchSnapshot(): void;
    }
  }
}

export { initializeSnapshots };

export function load(module: NodeModule) {
  const specDirectoryPath = path.dirname(module.filename);
  const specFileName = path.basename(module.filename);
  const snapshotDirectoryPath = path.resolve(specDirectoryPath, '__snapshots__/');
  const snapshotFilePath = path.resolve(snapshotDirectoryPath, `${specFileName}.${getConfig().fileExtension}`);

  mkdirp.sync(snapshotDirectoryPath);
  getRunner().loadSnapshots(snapshotFilePath);
}

export function save() {
  getRunner().saveSnapshots();
}
