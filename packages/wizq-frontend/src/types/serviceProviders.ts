export interface ServiceProvider {
  id: string;
  name: string;
  role: string;
  isVerified: boolean;
  avatar: string;
  isOnline: boolean;
  location: string;
  score: number;
}
