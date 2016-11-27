import './src/component-fixture';
import { installSnapshotMatcher } from './src/matcher';
import { initializeSnapshots, getRunner, getConfig } from './src/env';


jasmine.getEnv().beforeAll(installSnapshotMatcher);

function load(module: NodeModule) {
  getRunner().loadSnapshots(`${module.filename}.${getConfig().fileExtension}`);
}

function save() {
  getRunner().saveSnapshots();
}

export {
  initializeSnapshots,
  load,
  save,
};