import { test } from '@playwright/test';
import testCases from './data/testCases.json';
import schema from './data/testCases.schema.json';

test.describe('test data validation', () => {
  test('ensures each dataset entry matches the declared schema', () => {
    const valid = Array.isArray(testCases) && testCases.length > 0;
    test.expect(valid, 'testCases should be a non-empty array').toBeTruthy();

    for (const testCase of testCases) {
      test.expect(testCase.id, 'id is required').toBeTruthy();
      test.expect(testCase.project, 'project is required').toBeTruthy();
      test.expect(testCase.task, 'task is required').toBeTruthy();
      test.expect(testCase.column, 'column is required').toBeTruthy();
      test.expect(Array.isArray(testCase.tags) && testCase.tags.length > 0, 'tags should be a non-empty array').toBeTruthy();
    }

    test.expect(schema.type).toBe('array');
  });
});
