import { validateOtp } from "./validate-otp";

describe('validateOtp', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  it('should result an error message when `email` is not provided', async () => {
    const mockFns = {
      request: jest.fn(),
      response: {
        writeHead: jest.fn(),
        end: jest.fn(),
      },
      serializeRequest: jest.fn(() => JSON.stringify({ otp: '' })),
      persistenceAdapter: jest.fn(),
      otpExpiryDuration: jest.fn(),
      jwtSecretKey: jest.fn(),
      generateToken: jest.fn(),
    };

    await validateOtp(
      mockFns.request as never,
      mockFns.response as never,
      mockFns.serializeRequest as never,
      mockFns.persistenceAdapter as never,
      mockFns.otpExpiryDuration as never,
      mockFns.jwtSecretKey as never,
      mockFns.generateToken as never
    );

    expect(mockFns.response.writeHead).toBeCalledTimes(1);
    expect(mockFns.response.writeHead.mock.calls[0][0]).toEqual(400);
    expect(mockFns.response.writeHead.mock.calls[0][1]).toStrictEqual({
      'Content-Type': 'application/json',
    });
    expect(mockFns.response.end).toBeCalledTimes(1);
    expect(mockFns.response.end.mock.calls[0][0]).toEqual(JSON.stringify({
      message: '`email` should be provided',
    }));
  });

  it('should result an error message when `otp` is not provided', async () => {
    const mockFns = {
      request: jest.fn(),
      response: {
        writeHead: jest.fn(),
        end: jest.fn(),
      },
      serializeRequest: jest.fn(() => JSON.stringify({ email: 'test@hov.co' })),
      persistenceAdapter: jest.fn(),
      otpExpiryDuration: jest.fn(),
      jwtSecretKey: jest.fn(),
      generateToken: jest.fn(),
    };

    await validateOtp(
      mockFns.request as never,
      mockFns.response as never,
      mockFns.serializeRequest as never,
      mockFns.persistenceAdapter as never,
      mockFns.otpExpiryDuration as never,
      mockFns.jwtSecretKey as never,
      mockFns.generateToken as never
    );

    expect(mockFns.response.writeHead).toBeCalledTimes(1);
    expect(mockFns.response.writeHead.mock.calls[0][0]).toEqual(400);
    expect(mockFns.response.writeHead.mock.calls[0][1]).toStrictEqual({
      'Content-Type': 'application/json',
    });
    expect(mockFns.response.end).toBeCalledTimes(1);
    expect(mockFns.response.end.mock.calls[0][0]).toEqual(JSON.stringify({
      message: '`otp` should be provided',
    }));
  });

  it('should call PersistenceAdapter#findOneUserByEmail with correct arguments', async () => {
    const mockFns = {
      request: jest.fn(),
      response: {
        writeHead: jest.fn(),
        end: jest.fn(),
      },
      serializeRequest: jest.fn(() => JSON.stringify({ 
        email: 'test@hov.co',
        otp: '123456',
      })),
      persistenceAdapter: {
        findOneUserByEmail: jest.fn((params) => params && null),
      },
      otpExpiryDuration: jest.fn(),
      jwtSecretKey: jest.fn(),
      generateToken: jest.fn(),
    };

    await validateOtp(
      mockFns.request as never,
      mockFns.response as never,
      mockFns.serializeRequest as never,
      mockFns.persistenceAdapter as never,
      mockFns.otpExpiryDuration as never,
      mockFns.jwtSecretKey as never,
      mockFns.generateToken as never
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
      serializeRequest: jest.fn(() => JSON.stringify({ 
        email: 'test@hov.co',
        otp: '123456',
      })),
      persistenceAdapter: {
        findOneUserByEmail: jest.fn((params) => params && null),
      },
      otpExpiryDuration: jest.fn(),
      jwtSecretKey: jest.fn(),
      generateToken: jest.fn(),
    };

    await validateOtp(
      mockFns.request as never,
      mockFns.response as never,
      mockFns.serializeRequest as never,
      mockFns.persistenceAdapter as never,
      mockFns.otpExpiryDuration as never,
      mockFns.jwtSecretKey as never,
      mockFns.generateToken as never
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
  
  it('should call Persistence#findOneEmailOtp with correct arguments', async () => {
    const id = Buffer.from('1');

    const mockFns = {
      request: jest.fn(),
      response: {
        writeHead: jest.fn(),
        end: jest.fn(),
      },
      serializeRequest: jest.fn(() => JSON.stringify({ 
        email: 'test@hov.co',
        otp: '123456',
      })),
      persistenceAdapter: {
        findOneUserByEmail: jest.fn((params) => params && ({
          _id: id,
        })),
        findOneEmailOtp: jest.fn(),
      },
      otpExpiryDuration: jest.fn(),
      jwtSecretKey: jest.fn(),
      generateToken: jest.fn(),
    };

    await validateOtp(
      mockFns.request as never,
      mockFns.response as never,
      mockFns.serializeRequest as never,
      mockFns.persistenceAdapter as never,
      mockFns.otpExpiryDuration as never,
      mockFns.jwtSecretKey as never,
      mockFns.generateToken as never
    );

    expect(mockFns.persistenceAdapter.findOneEmailOtp).toBeCalledTimes(1);
    expect(mockFns.persistenceAdapter.findOneEmailOtp.mock.calls[0][0]).toStrictEqual({
      user: id,
      otp: '123456',
    });
  });
  
  it('should result an error message when the found otp is null', async () => {
    const id = Buffer.from('1');

    const mockFns = {
      request: jest.fn(),
      response: {
        writeHead: jest.fn(),
        end: jest.fn(),
      },
      serializeRequest: jest.fn(() => JSON.stringify({ 
        email: 'test@hov.co',
        otp: '123456',
      })),
      persistenceAdapter: {
        findOneUserByEmail: jest.fn((params) => params && ({
          _id: id,
        })),
        findOneEmailOtp: jest.fn(() => null),
      },
      otpExpiryDuration: jest.fn(),
      jwtSecretKey: jest.fn(),
      generateToken: jest.fn(),
    };

    await validateOtp(
      mockFns.request as never,
      mockFns.response as never,
      mockFns.serializeRequest as never,
      mockFns.persistenceAdapter as never,
      mockFns.otpExpiryDuration as never,
      mockFns.jwtSecretKey as never,
      mockFns.generateToken as never
    );

    expect(mockFns.response.writeHead).toBeCalledTimes(1);
    expect(mockFns.response.writeHead.mock.calls[0][0]).toEqual(400);
    expect(mockFns.response.writeHead.mock.calls[0][1]).toStrictEqual({
      'Content-Type': 'application/json',
    });
    expect(mockFns.response.end).toBeCalledTimes(1);
    expect(mockFns.response.end.mock.calls[0][0]).toEqual(JSON.stringify({
      message: 'invalid `otp` or `email`',
    }));
  });
  
  it('should result an error message when the provided otp is expired', async () => {
    const now = new Date();

    jest.useFakeTimers().setSystemTime(now);

    const id = Buffer.from('1');

    const mockFns = {
      request: jest.fn(),
      response: {
        writeHead: jest.fn(),
        end: jest.fn(),
      },
      serializeRequest: jest.fn(() => JSON.stringify({ 
        email: 'test@hov.co',
        otp: '123456',
      })),
      persistenceAdapter: {
        findOneUserByEmail: jest.fn((params) => params && ({
          _id: id,
        })),
        findOneEmailOtp: jest.fn(() => ({
          createdAt: new Date('2021-01-01')
        })),
      },
      otpExpiryDuration: 30000,
      jwtSecretKey: jest.fn(),
      generateToken: jest.fn(),
    };

    await validateOtp(
      mockFns.request as never,
      mockFns.response as never,
      mockFns.serializeRequest as never,
      mockFns.persistenceAdapter as never,
      mockFns.otpExpiryDuration as never,
      mockFns.jwtSecretKey as never,
      mockFns.generateToken as never
    );

    expect(mockFns.response.writeHead).toBeCalledTimes(1);
    expect(mockFns.response.writeHead.mock.calls[0][0]).toEqual(400);
    expect(mockFns.response.writeHead.mock.calls[0][1]).toStrictEqual({
      'Content-Type': 'application/json',
    });
    expect(mockFns.response.end).toBeCalledTimes(1);
    expect(mockFns.response.end.mock.calls[0][0]).toEqual(JSON.stringify({
      message: 'otp already past 30000ms',
    }));
  });
  
  it('should call generateToken with correct arguments', async () => {
    const now = new Date();

    jest.useFakeTimers().setSystemTime(now);

    const id = Buffer.from('1');

    const mockFns = {
      request: jest.fn(),
      response: {
        writeHead: jest.fn(),
        end: jest.fn(),
      },
      serializeRequest: jest.fn(() => JSON.stringify({ 
        email: 'test@hov.co',
        otp: '123456',
      })),
      persistenceAdapter: {
        findOneUserByEmail: jest.fn((params) => params && ({
          _id: id,
        })),
        findOneEmailOtp: jest.fn(() => ({
          createdAt: now
        })),
        deleteRelatedOtps: jest.fn(),
      },
      otpExpiryDuration: 30000,
      jwtSecretKey: 'abcd',
      generateToken: jest.fn((params) => params && '12345'),
    };

    await validateOtp(
      mockFns.request as never,
      mockFns.response as never,
      mockFns.serializeRequest as never,
      mockFns.persistenceAdapter as never,
      mockFns.otpExpiryDuration as never,
      mockFns.jwtSecretKey as never,
      mockFns.generateToken as never
    );

    expect(mockFns.response.writeHead).toBeCalledTimes(1);
    expect(mockFns.response.writeHead.mock.calls[0][0]).toEqual(200);
    expect(mockFns.response.writeHead.mock.calls[0][1]).toStrictEqual({
      'Content-Type': 'application/json',
    });
    expect(mockFns.response.end).toBeCalledTimes(1);
    expect(mockFns.response.end.mock.calls[0][0]).toEqual(JSON.stringify({
      token: 'Bearer 12345'
    }));
    expect(mockFns.generateToken).toBeCalledTimes(1);
    expect(mockFns.generateToken.mock.calls[0][0]).toStrictEqual({
      payload: {
        subject: id,
        id,
      },
      secret: 'abcd'
    });
  });
  
  it('should call PersistenceAdapter#.deleteReleatedOtps with correct arguments', async () => {
    const now = new Date();

    jest.useFakeTimers().setSystemTime(now);

    const id = Buffer.from('1');

    const mockFns = {
      request: jest.fn(),
      response: {
        writeHead: jest.fn(),
        end: jest.fn(),
      },
      serializeRequest: jest.fn(() => JSON.stringify({ 
        email: 'test@hov.co',
        otp: '123456',
      })),
      persistenceAdapter: {
        findOneUserByEmail: jest.fn((params) => params && ({
          _id: id,
        })),
        findOneEmailOtp: jest.fn(() => ({
          createdAt: now
        })),
        deleteRelatedOtps: jest.fn(),
      },
      otpExpiryDuration: 30000,
      jwtSecretKey: 'abcd',
      generateToken: jest.fn((params) => params && '12345'),
    };

    await validateOtp(
      mockFns.request as never,
      mockFns.response as never,
      mockFns.serializeRequest as never,
      mockFns.persistenceAdapter as never,
      mockFns.otpExpiryDuration as never,
      mockFns.jwtSecretKey as never,
      mockFns.generateToken as never
    );
    expect(mockFns.persistenceAdapter.deleteRelatedOtps).toBeCalledTimes(1);
    expect(mockFns.persistenceAdapter.deleteRelatedOtps.mock.calls[0][0]).toStrictEqual({
      user: id,
    });
  });
});