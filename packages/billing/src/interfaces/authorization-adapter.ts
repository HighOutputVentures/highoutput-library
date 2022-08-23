type User = {
  id: Buffer;
};

export interface AuthorizationAdapter {
  authorize(params: {
    scheme: 'Bearer';
    parameters: string;
  }): Promise<User | null>;
}
