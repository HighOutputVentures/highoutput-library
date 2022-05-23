import { getRequestData } from './get-request-data';

describe('getRequestData', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  it('should resolve', async () => {
    const mockFn = {
      request: {
        on: jest.fn(),
      },
    };

    Promise.all([getRequestData(
      mockFn.request as never,
    )]);

    expect(mockFn.request.on).toBeCalledTimes(2);
    expect(mockFn.request.on.mock.calls[0][0]).toBe('data');
    expect(mockFn.request.on.mock.calls[1][0]).toBe('end');
  });

  it('should throw error', async () => {
    const mockFn = {
      request: {
        on: jest.fn(() => { throw new Error('Error') }),
      },
    };

    await expect(getRequestData(mockFn.request as never)).rejects.toThrow('Error');

    // expect(mockFn.request.on).toBeCalledTimes(2);
    // expect(mockFn.request.on.mock.calls[0][0]).toBe('data');
    // expect(mockFn.request.on.mock.calls[1][0]).toBe('end');
  });
});
