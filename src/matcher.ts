import { getRunner } from './env';

declare global {
  namespace jasmine {
    interface Matchers {
      toMatchSnapshot(): void;
    }
  }
}

export function toMatchSnapshot(actual) {
  return getRunner().compareSnapshot(actual);
}

export const installSnapshotMatcher = () => jasmine.addMatchers({
  toMatchSnapshot: () => ({
    compare: toMatchSnapshot
  })
});