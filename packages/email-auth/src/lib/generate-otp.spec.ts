describe('generateOtp', () => {
  it.todo('should result an error message when the body have empty `message.to`');

  it.todo('should call the PersistenceAdapter#findOneUserByEmail with correct arguments');

  it.todo('should result an error message when the found user is null');

  it.todo('should call the PersistenceAdapter#findOneEmailOtp with correct arguments');

  it.todo('should result an error message when generating another otp within the expiry duration');

  it.todo('should call PersistenceAdapter#createEmailOtp with correct arguments');

  it.todo('should call EmailProviderAdapter#sendEmail with correct arguments');

  it.todo('should have the correct body content when everything is successfult');
});