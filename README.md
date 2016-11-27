# angular-snapshot-testing
Angular component snapshot testing for Jasmine

### How to Use

1. Install the extension:
  Via npm:
  ```
  npm install jasmine-angular-snapshot-testing --save-dev
  ```

  Via yarn:
  ```
  yarn add jasmine-angular-snapshot-testing --dev
  ```

2. Initialize the testing environment
  This extension requries you to run your unit tests on node instead of in a browser.
  This requires `@angular/platform-server`:

  ```ts
  import { getTestBed } from '@angular/core/testing';
  import { ServerTestingModule, platformServerTesting } from '@angular/platform-server/testing';

  getTestBed().initTestEnvironment(
    ServerTestingModule,
    platformServerTesting()
  );
  ```

3. Configure the extension:
  After initializing the test environment initialize the snapshot testing extension:

  ```ts
  import { initializeSnapshots } from 'jasmine-angular-snapshot-testing';


  initializeSnapshots({
    /**
     * This flag will cause tests to fail if a new snapshot shoudl be generated.
     * Generally, you want to set this value to true when running tests on CI
     * and false when writing new unit tests
     */
    failOnSnapshotDiscovery: false,
    /**
     * This is the file extension that will be appended to the end of test
     * files when generating a snapshot file.
     *
     * For example, if this is set to 'snap' and the spec file is called
     * 'table.component.spec.ts' then the generated file will be called
     * 'table.component.spec.ts.snap'
     */
     fileExtension: 'snap',
     /**
      * This flag will cause new snapshots to overwrite existing snapshots.
      * This is useful during development.
      *
      * Be aware that if this is set to 'true' snapshot tests will never fail.
      */
      discardOldSnapshots: false,
  });
  ```

4. Use beforeAll/afterAll hooks to load and save snapshots:
  This must be done in each spec file:
  
  ```ts
  import * as snapshots from 'jasmine-angular-snapshot-testing';

  describe('Table Component', () => {
    beforeAll(() => snapshots.load(module));
    afterAll(() => snapshots.save());
  });
  ```

5. Generate snapshots:
  Use the new `toMatchSnapshot()` matcher to generate snapshots for any
  object that implements `.toJSON()`. Note that this module adds a
  `.toJSON()` method to component fixtures:

  ```ts
  let fixture: ComponentFixture<TableComponent>;

  beforeEach(async(() => {
    TestBed.compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(TableComponent);
        fixture.detectChanges();
      });
  }));

  it('should compile successfully', () => {
    expect(fixture).toMatchSnapshot();
  });
  ```

### Caveats
This module has a number of caveats that restrict the type of components
that can be tested with snapshots:

* Unit tests must be run on node instead of a browser. This is a 
  requirement because this extension requires access to the filesystem

* Components cannot make use of external stylesheets or templates. 
  This is because `platform-server` does not implement a `ResourceLoader`, 
  though one may be able to be written.