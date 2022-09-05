export type User = { id: string };

export interface IAuthorizationAdapter {
  authorize(params: { header: Record<string, string> }): Promise<User | null>;
}
