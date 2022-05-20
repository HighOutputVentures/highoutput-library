describe('validateOtp', () => {
  it.todo('should result an error message when `email` is not provided');
  it.todo('should result an error message when `otp` is not provided');
  it.todo('should call PersistenceAdapter#findOneUserByEmail with correct arguments');
  it.todo('should result an error message when the found user is null');
  it.todo('should call Persistence#findOneEmailOtp with correct arguments');
  it.todo('should result an error message when the found otp is null');
  it.todo('should result an error message when the provided otp is expired');
  it.todo('should call generateToken with correct arguments');
  it.todo('should call PersistenceAdapter#.deleteReleatedOtps with correct arguments');
});