import { Injectable } from '@angular/core';
import * as fs from 'fs';


@Injectable()
export abstract class FileSystemAdapter {
  abstract fileExists(path: string): boolean;
  abstract loadFile(path: string): string;
  abstract saveFile(path: string, content: string): void;
}

@Injectable()
export class NodeFileSystemAdapterBackend {
  get filesystem() {
    return fs;
  }
}

@Injectable()
export class NodeFileSystemAdapter extends FileSystemAdapter {
  constructor(private backend: NodeFileSystemAdapterBackend) {
    super();
  }

  fileExists(path: string) {
    return this.backend.filesystem.existsSync(path);
  }

  loadFile(path: string) {
    return this.backend.filesystem.readFileSync(path, 'utf8');
  }

  saveFile(path: string, content: string) {
    this.backend.filesystem.writeFileSync(path, content, 'utf8');
  }
}


export const PROVIDERS = [
  { provide: FileSystemAdapter, useClass: NodeFileSystemAdapter },
  NodeFileSystemAdapterBackend
];