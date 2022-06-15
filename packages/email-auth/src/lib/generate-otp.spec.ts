import { generateOtp } from './generate-otp';

describe('generateOtp', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  it('should result an error message when the body have empty `message.to`', async () => {
    const mockFns = {
      request: jest.fn(),
      response: {
        writeHead: jest.fn(),
        end: jest.fn(),
      },
      serializeRequest: jest.fn(() => JSON.stringify({ message: { from: '' }})),
      persistenceAdapter: jest.fn(),
      emailProviderAdapter: jest.fn(),
      otpExpiryDuration: jest.fn(),
    };

    await generateOtp(
      mockFns.request as never,
      mockFns.response as never,
      mockFns.serializeRequest as never,
      mockFns.persistenceAdapter as never,
      mockFns.emailProviderAdapter as never,
      mockFns.otpExpiryDuration as never,
    );

    expect(mockFns.response.writeHead).toBeCalledTimes(1);
    expect(mockFns.response.writeHead.mock.calls[0][0]).toEqual(400);
    expect(mockFns.response.writeHead.mock.calls[0][1]).toStrictEqual({
      'Content-Type': 'application/json',
    });
    expect(mockFns.response.end).toBeCalledTimes(1);
    expect(mockFns.response.end.mock.calls[0][0]).toEqual(JSON.stringify({
      message: '`to` should be supplied',
    }));
  });

  it('should call the PersistenceAdapter#findOneUserByEmail with correct arguments', async () => {
    const mockFns = {
      request: jest.fn(),
      response: {
        writeHead: jest.fn(),
        end: jest.fn(),
      },
      serializeRequest: jest.fn(() => JSON.stringify({ message: { to: 'test@hov.co' }})),
      persistenceAdapter: {
        findOneUserByEmail: jest.fn(),
      },
      emailProviderAdapter: jest.fn(),
      otpExpiryDuration: jest.fn(),
    };

    await generateOtp(
      mockFns.request as never,
      mockFns.response as never,
      mockFns.serializeRequest as never,
      mockFns.persistenceAdapter as never,
      mockFns.emailProviderAdapter as never,
      mockFns.otpExpiryDuration as never,
    );

    expect(mockFns.persistenceAdapter.findOneUserByEmail).toBeCalledTimes(1);
    expect(mockFns.persistenceAdapter.findOneUserByEmail.mock.calls[0][0]).toStrictEqual({
      email: 'test@hov.co'
    });
  });

  it('should result an error message when the found user is null', async () => {
    const mockFns = {
      request: jest.fn(),
      response: {
        writeHead: jest.fn(),
        end: jest.fn(),
      },
      serializeRequest: jest.fn(() => JSON.stringify({ message: { to: 'test@hov.co' }})),
      persistenceAdapter: {
        findOneUserByEmail: jest.fn(() => null),
      },
      emailProviderAdapter: jest.fn(),
      otpExpiryDuration: jest.fn(),
    };

    await generateOtp(
      mockFns.request as never,
      mockFns.response as never,
      mockFns.serializeRequest as never,
      mockFns.persistenceAdapter as never,
      mockFns.emailProviderAdapter as never,
      mockFns.otpExpiryDuration as never,
    );

    expect(mockFns.response.writeHead).toBeCalledTimes(1);
    expect(mockFns.response.writeHead.mock.calls[0][0]).toEqual(400);
    expect(mockFns.response.writeHead.mock.calls[0][1]).toStrictEqual({
      'Content-Type': 'application/json',
    });
    expect(mockFns.response.end).toBeCalledTimes(1);
    expect(mockFns.response.end.mock.calls[0][0]).toEqual(JSON.stringify({
      message: '`email` is invalid',
    }));
  });

  it('should call the PersistenceAdapter#findOneEmailOtp with correct arguments', async () => {
    const id = Buffer.from('1');

    const mockFns = {
      request: jest.fn(),
      response: {
        writeHead: jest.fn(),
        end: jest.fn(),
      },
      serializeRequest: jest.fn(() => JSON.stringify({ message: { to: 'test@hov.co' }})),
      persistenceAdapter: {
        findOneUserByEmail: jest.fn(() => ({ _id: id })),
        findOneEmailOtp: jest.fn(),
        createEmailOtp: jest.fn(() => ({ otp: '123456' })),
      },
      emailProviderAdapter: {
        sendEmail: jest.fn(),
      },
      otpExpiryDuration: jest.fn(),
    };

    await generateOtp(
      mockFns.request as never,
      mockFns.response as never,
      mockFns.serializeRequest as never,
      mockFns.persistenceAdapter as never,
      mockFns.emailProviderAdapter as never,
      mockFns.otpExpiryDuration as never,
    );

    expect(mockFns.persistenceAdapter.findOneEmailOtp).toBeCalledTimes(1);
    expect(mockFns.persistenceAdapter.findOneEmailOtp.mock.calls[0][0]).toStrictEqual({
      user: id,
    });
  });

  it('should result an error message when generating another otp within the expiry duration', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2020-01-01'));

    const OTP_EXPIRY_DURATION = 30_000;

    const id = Buffer.from('1');

    const mockFns = {
      request: jest.fn(),
      response: {
        writeHead: jest.fn(),
        end: jest.fn(),
      },
      serializeRequest: jest.fn(() => JSON.stringify({ message: { to: 'test@hov.co' }})),
      persistenceAdapter: {
        findOneUserByEmail: jest.fn(() => ({ _id: id })),
        findOneEmailOtp: jest.fn(() => ({ createdAt: new Date('2020-01-01') })),
      },
      emailProviderAdapter: {
        sendEmail: jest.fn(),
      },
      otpExpiryDuration: OTP_EXPIRY_DURATION,
    };

    await generateOtp(
      mockFns.request as never,
      mockFns.response as never,
      mockFns.serializeRequest as never,
      mockFns.persistenceAdapter as never,
      mockFns.emailProviderAdapter as never,
      mockFns.otpExpiryDuration as never,
    );
    
    expect(mockFns.response.writeHead).toBeCalledTimes(1);
    expect(mockFns.response.writeHead.mock.calls[0][0]).toEqual(400);
    expect(mockFns.response.writeHead.mock.calls[0][1]).toStrictEqual({
      'Content-Type': 'application/json',
    });
    expect(mockFns.response.end).toBeCalledTimes(1);
    expect(mockFns.response.end.mock.calls[0][0]).toEqual(JSON.stringify({
      message: `cannot generate another otp within ${OTP_EXPIRY_DURATION}ms`,
    }));
  });

  it('should call PersistenceAdapter#createEmailOtp with correct arguments', async () => {
    const now = new Date();

    jest.useFakeTimers().setSystemTime(now);

    const id = Buffer.from('1');

    const mockFns = {
      request: jest.fn(),
      response: {
        writeHead: jest.fn(),
        end: jest.fn(),
      },
      serializeRequest: jest.fn(() => JSON.stringify({ message: { to: 'test@hov.co' }})),
      persistenceAdapter: {
        findOneUserByEmail: jest.fn(() => ({ _id: id })),
        findOneEmailOtp: jest.fn(() => ({ createdAt: new Date('2020-01-01') })),
        createEmailOtp: jest.fn((params) => params && ({ otp: '123456' })),
      },
      emailProviderAdapter: {
        sendEmail: jest.fn(),
      },
      otpExpiryDuration: jest.fn(),
    };

    await generateOtp(
      mockFns.request as never,
      mockFns.response as never,
      mockFns.serializeRequest as never,
      mockFns.persistenceAdapter as never,
      mockFns.emailProviderAdapter as never,
      mockFns.otpExpiryDuration as never,
    );

    expect(mockFns.persistenceAdapter.createEmailOtp).toBeCalledTimes(1);
    expect(mockFns.persistenceAdapter.createEmailOtp.mock.calls[0][0]).toStrictEqual({
      data: { user: id, createdAt: now },
    });
  });

  it('should call EmailProviderAdapter#sendEmail with correct arguments', async () => {
    const now = new Date();

    jest.useFakeTimers().setSystemTime(now);

    const id = Buffer.from('1');

    const mockFns = {
      request: jest.fn(),
      response: {
        writeHead: jest.fn(),
        end: jest.fn(),
      },
      serializeRequest: jest.fn(() => JSON.stringify({ message: { to: 'test@hov.co' }})),
      persistenceAdapter: {
        findOneUserByEmail: jest.fn(() => ({ _id: id })),
        findOneEmailOtp: jest.fn(() => ({ createdAt: new Date('2020-01-01') })),
        createEmailOtp: jest.fn((params) => params && ({ otp: '123456' })),
      },
      emailProviderAdapter: {
        sendEmail: jest.fn(),
        senderEmail: 'sender@hov.co',
        name: 'no-reply',
      },
      otpExpiryDuration: jest.fn(),
    };

    await generateOtp(
      mockFns.request as never,
      mockFns.response as never,
      mockFns.serializeRequest as never,
      mockFns.persistenceAdapter as never,
      mockFns.emailProviderAdapter as never,
      mockFns.otpExpiryDuration as never,
    );

    expect(mockFns.emailProviderAdapter.sendEmail).toBeCalledTimes(1);
    expect(mockFns.emailProviderAdapter.sendEmail.mock.calls[0][0]).toStrictEqual({
      to: 'test@hov.co',
      from: {
        email: 'sender@hov.co',
        name: 'no-reply',
      },
      subject: 'otp authorization',
      text: '123456',
    });
  });

  it('should have the correct body content when everything is successfult', async () => {
    const now = new Date();

    jest.useFakeTimers().setSystemTime(now);

    const id = Buffer.from('1');

    const mockFns = {
      request: jest.fn(),
      response: {
        writeHead: jest.fn(),
        end: jest.fn(),
      },
      serializeRequest: jest.fn(() => JSON.stringify({ message: { to: 'test@hov.co' }})),
      persistenceAdapter: {
        findOneUserByEmail: jest.fn(() => ({ _id: id })),
        findOneEmailOtp: jest.fn(() => ({ createdAt: new Date('2020-01-01') })),
        createEmailOtp: jest.fn((params) => params && ({ otp: '123456' })),
      },
      emailProviderAdapter: {
        sendEmail: jest.fn(),
        senderEmail: 'sender@hov.co',
        name: 'no-reply',
      },
      otpExpiryDuration: jest.fn(),
    };

    await generateOtp(
      mockFns.request as never,
      mockFns.response as never,
      mockFns.serializeRequest as never,
      mockFns.persistenceAdapter as never,
      mockFns.emailProviderAdapter as never,
      mockFns.otpExpiryDuration as never,
    );

    expect(mockFns.response.writeHead).toBeCalledTimes(1);
    expect(mockFns.response.writeHead.mock.calls[0][0]).toEqual(200);
    expect(mockFns.response.writeHead.mock.calls[0][1]).toStrictEqual({
      'Content-Type': 'application/json',
    });
    expect(mockFns.response.end).toBeCalledTimes(1);
    expect(mockFns.response.end.mock.calls[0][0]).toEqual(JSON.stringify({
      message: '`otp` sent through email',
    }));
  });
});