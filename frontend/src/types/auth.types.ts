export interface AuthDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
}

export interface UserProfile {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
}