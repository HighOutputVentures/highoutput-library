export type DefaultOtpEntity = {
  otp: string;
  email: string;
};

export interface PersistenceAdapter<
  TEntity extends DefaultOtpEntity = DefaultOtpEntity,
  TCreate extends Pick<DefaultOtpEntity, 'email'> = Pick<DefaultOtpEntity, 'email'>,
  TFind extends Pick<DefaultOtpEntity, 'email' | 'otp'> = Pick<DefaultOtpEntity, 'email' | 'otp'>,
> {
  create(input: { data: TCreate }): Promise<TEntity>;
  findOne(params: TFind): Promise<TEntity | null>;
}