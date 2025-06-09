const Sequencer = require('@jest/test-sequencer').default;

class CustomSequencer extends Sequencer {
  sort(tests) {
    const orderPath = [
      'auth-e2e.spec.ts',
      'clients-e2e.spec.ts',
      'auditLogs-e2e.spec.ts', 
      'dashboard-e2e.spec.ts',
      'requests-e2e.spec.ts',
      'trucks-e2e.spec.ts',
      'carriers-e2e.spec.ts',
      'routes-e2e.spec.ts',
      'billing-e2e.spec.ts',
      'users-e2e.spec.ts'
    ];

    return tests.sort((testA, testB) => {
      const indexA = orderPath.findIndex(path => testA.path.includes(path));
      const indexB = orderPath.findIndex(path => testB.path.includes(path));

      if (indexA === -1) return 1;
      if (indexB === -1) return -1;

      return indexA - indexB;
    });
  }
}

module.exports = CustomSequencer;
