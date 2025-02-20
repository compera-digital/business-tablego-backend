export * from './dto';
export * from './models';

export interface ILoginResponseDto {
  id: string;
  email: string;
  name: string;
  lastName: string;
  isVerified: boolean;
}