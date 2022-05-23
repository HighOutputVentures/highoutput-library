import { generateToken } from './generate-token';

describe('generateToken', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return a token', async () => {
    const INPUT_STRING = 'Hello';
    const SECRET_STRING = 'JSON_SECRET';

    const input = {
      payload: {
        id: Buffer.from(INPUT_STRING),
        subject: Buffer.from(INPUT_STRING),
      },
      secret: SECRET_STRING,
    };

    const token = generateToken(input);

    expect(typeof token).toBe('string');
    expect(token).toBeDefined();
  });
});
