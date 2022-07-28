import program from '../../src/program';
import nock from 'nock';
import { API_BASE_URL } from '../../src/library/contants';
import { generateUser } from '../helpers.next/generate-user';

describe('user', () => {
  afterEach(async function () {
    jest.restoreAllMocks();
  });

  describe('delete', () => {
    test('delete user', async () => {
      const user = generateUser();

      nock(API_BASE_URL)
        .delete(`/users/${user.id.toString()}`)
        .reply(200, () => {
          return {
            ...user,
            id: user.id.toString(),
          };
        });

      const spy = jest.spyOn(global.console, 'log');

      await program.parseAsync([
        'node',
        './dist/index.js',
        'user',
        'delete',
        user.id.toString(),
      ]);

      const outputs = spy.mock.calls[0][0];
      expect(outputs).toEqual(`User ${user.name} got deleted`);
    });
  });
});
