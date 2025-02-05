export interface User {
  id: string;
  name: string;
  lastName: string;
  email: string;
  referralCode: string | null;
  password: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Restaurant {
  id: string;
  name: string;
  description?: string;
  address: string;
  city: string;
  country: string;
  phone?: string;
  email: string;
  website?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Diğer model tipleri... 