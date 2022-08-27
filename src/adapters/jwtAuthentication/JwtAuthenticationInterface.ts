export interface JwtAuthenticationInterface {
  verifyJwt(token: string): Promise<string>;
}
