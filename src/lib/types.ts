// studio
export interface CsStudio {
  _id: string;
  title: string;
  category: string;
  hourlyRate: number;
  securityDeposit: number;
  maxCapacity: number;
  location: string;
  images: string[];
  amenities: string[];
  overview: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhoto?: string;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

// paginated list
export interface CsStudioList {
  studios: CsStudio[];
  total: number;
  page: number;
  totalPages: number;
}
