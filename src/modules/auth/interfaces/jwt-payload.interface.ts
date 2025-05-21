// Object: Interface for JWT payload
export interface JwtPayload {
  _id: string;
  name: string;
  username: string;
  phone: string;
  email: string;
  role: string[];
  permissions: string[];
  membership: string[];
}
