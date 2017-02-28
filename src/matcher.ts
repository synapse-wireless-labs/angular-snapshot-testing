import { getRunner } from './env';


export function toMatchSnapshot(actual) {
  return getRunner().compareSnapshot(actual);
}

export const installSnapshotMatcher = () => jasmine.addMatchers({
  toMatchSnapshot: () => ({
    compare: toMatchSnapshot
  })
});
