import * as diff from 'diff';
import * as chalk from 'chalk';


export function diffSnapshots(oldSnapshot: string, newSnapshot: string) {
  const result = diff.diffLines(oldSnapshot, newSnapshot);

  const message = result.map(chunk => {
    const color = chunk.added ? chalk.green : chunk.removed ? chalk.red : chalk.grey;

    return color(chunk.value);
  }).join('\n');

  const pass = result.reduce((all, next) => {
    return all && !next.added && !next.removed;
  }, true);

  return {
    pass,
    message: `Snapshot did not match baseline: \n \n${message}`
  };
}
