type User = {
  id: Buffer;
};

export interface AuthorizationAdapter {
  authorize(ctx: unknown): Promise<User | null>;
}
