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

// review
export interface CsReview {
  _id: string;
  studioId: string;
  userName: string;
  userPhoto?: string;
  rating: number;
  comment: string;
  createdAt: string;
}

// explore filters
export interface CsStudioQuery {
  category: string;
  search: string;
  sort: string;
  page: string;
}

// booking
export type CsBookingStatus = "Pending" | "Confirmed" | "Completed" | "Cancelled";

export interface CsBooking {
  _id: string;
  studioId: string;
  studioTitle: string;
  studioImage: string;
  studioLocation: string;
  hostName: string;
  hostEmail: string;
  userName: string;
  userEmail: string;
  date: string;
  startTime: string;
  endTime: string;
  hours: number;
  hourlyRate: number;
  securityDeposit: number;
  subtotal: number;
  totalPrice: number;
  status: CsBookingStatus;
  createdAt: string;
}

// dashboard
export interface CsDashboard {
  listings: number;
  bookings: { total: number; pending: number; confirmed: number };
  requests: { pending: number; confirmed: number };
  earnings: number;
}

// studio form values
export interface CsStudioInput {
  title: string;
  category: string;
  hourlyRate: number;
  securityDeposit: number;
  maxCapacity: number;
  location: string;
  images: string[];
  amenities: string[];
  overview: string;
}
