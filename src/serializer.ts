import { Injectable } from '@angular/core';
import * as yaml from 'js-yaml';


@Injectable()
export class YamlSerializer {
  parse(content: string): any {
    return yaml.safeLoad(content);
  }

  serialize(content: any): string {
    return yaml.safeDump(content, { lineWidth: Infinity } as any);
  }
}

export const PROVIDERS = [
  YamlSerializer
];