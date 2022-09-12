
import program from '../../src/program';
import { ObjectID } from '../../src/types';
import nock from 'nock';
import { API_BASE_URL } from '../../src/library/contants';
import faker from '@faker-js/faker';

describe('deployment', () => {
  afterEach(async function() {
    jest.restoreAllMocks();
  });

  describe('logs', () => {
    test('show deployment log', async () => {
      const id = new ObjectID();
      const logs = faker.lorem.lines(5);
  
      nock(API_BASE_URL)
        .get(`/deployments/${id.toString()}/logs?tail=true&lines=5`)
        .reply(200, {
          id: id.toString(),
          logs,
        });
    
      const spy = jest.spyOn(global.console, 'log');
  
      const args = [
        'node',
        './dist/index.js',
        'deployment',
        'logs',
        id.toString(),
        '--tail',
        '--lines',
        '5',
      ];
  
      await program.parseAsync(args);
  
      const outputs = spy.mock.calls[0][0];
   
      expect(outputs.logs).toBe(logs);
    });
  });
});