// Object: Interface for JWT payload
export interface JwtPayload {
  _id: string;
  name: string;
  phone: string;
  email: string;
  role: string[];
  permissions: string[];
  message: string;
}
