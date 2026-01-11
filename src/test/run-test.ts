import * as path from 'path';
import Mocha from 'mocha';
import { glob } from 'glob';

export function run(): Promise<void> {
  const mocha = new Mocha({
    ui: 'tdd',
    color: true,
    timeout: 10000,
    reporter: 'spec',
    bail: false,
  });

  const testsRoot = path.resolve(__dirname);

  return new Promise((c, e) => {
    glob('suite/**/*.test.js', { cwd: testsRoot })
      .then((files) => {
        if (files.length === 0) {
          console.warn('No test files found in:', testsRoot);
          c();
          return;
        }

        console.log(`\n📋 Found ${files.length} test file(s):`);
        files.forEach((f: string) => {
          const fullPath = path.resolve(testsRoot, f);
          console.log(`  ✓ ${f}`);
          mocha.addFile(fullPath);
        });
        console.log('');

        mocha.run((failures: number) => {
          if (failures > 0) {
            console.error(`\n❌ ${failures} test(s) failed.\n`);
            e(new Error(`${failures} test(s) failed.`));
          } else {
            console.log('\n✅ All tests passed!\n');
            c();
          }
        });
      })
      .catch((err) => {
        console.error('❌ Error loading test files:', err);
        e(err as Error);
      });
  });
}
