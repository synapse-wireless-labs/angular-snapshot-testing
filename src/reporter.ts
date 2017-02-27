import { Injectable, Inject, OpaqueToken } from '@angular/core';
import { share } from 'rxjs/operator/share';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';


const observeSpecStarted = (env: jasmine.Env) => new Observable((observer: Observer<jasmine.Spec>) => {
  env.addReporter({
    specStarted: (result) => observer.next(result),
    jasmineDone: () => observer.complete()
  } as any);
});

const observeSpecDone = (env: jasmine.Env) => new Observable((observer: Observer<jasmine.Spec>) => {
  env.addReporter({
    specDone: (result) => observer.next(result),
    jasmineDone: () => observer.complete()
  } as any);
});


const observeSuiteStarted = (env: jasmine.Env) => new Observable((observer: Observer<jasmine.Suite>) => {
  env.addReporter({
    suiteStarted: (result) => observer.next(result),
    jasmineDone: () => observer.complete()
  } as any);
});


const observeSuiteDone = (env: jasmine.Env) => new Observable((observer: Observer<jasmine.Suite>) => {
  env.addReporter({
    suiteDone: (result) => observer.next(result),
    jasmineDone: () => observer.complete()
  } as any);
});

export const JASMINE_ENV = new OpaqueToken('Jasmine Env');

@Injectable()
export class SnapshotReporter {
  specStarted$: Observable<jasmine.Spec>;
  specDone$: Observable<jasmine.Spec>;
  suiteStarted$: Observable<jasmine.Suite>;
  suiteDone$: Observable<jasmine.Suite>;

  constructor(@Inject(JASMINE_ENV) env: jasmine.Env) {
    this.specStarted$ = share.call(observeSpecStarted(env));
    this.specDone$ = share.call(observeSpecDone(env));
    this.suiteStarted$ = share.call(observeSuiteStarted(env));
    this.suiteDone$ = share.call(observeSuiteDone(env));
  }
}


export const PROVIDERS = [
  { provide: JASMINE_ENV, useFactory: () => jasmine.getEnv() },
  SnapshotReporter
];
