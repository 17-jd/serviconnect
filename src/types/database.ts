export type UserRole = "customer" | "provider";

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "contract_pending"
  | "contract_signed"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "disputed";

export type PaymentMethod = "stripe" | "cash";
export type PaymentStatus = "pending" | "paid" | "refunded" | "failed";
export type DayOfWeek = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

export interface Profile {
  id: string;
  role: UserRole;
  full_name: string;
  email: string;
  phone: string | null;
  phone_verified: boolean;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProviderProfile {
  id: string;
  user_id: string;
  bio: string | null;
  headline: string | null;
  hourly_rate: number;
  location: unknown;
  address_text: string | null;
  service_radius: number;
  is_verified: boolean;
  is_active: boolean;
  rating_avg: number;
  rating_count: number;
  stripe_account_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string | null;
  is_popular: boolean;
  sort_order: number;
  created_at: string;
}

export interface ProviderService {
  id: string;
  provider_id: string;
  category_id: string;
  custom_rate: number | null;
  description: string | null;
}

export interface ProviderAvailability {
  id: string;
  provider_id: string;
  day: DayOfWeek;
  start_time: string;
  end_time: string;
  is_active: boolean;
}

export interface Booking {
  id: string;
  customer_id: string;
  provider_id: string;
  category_id: string;
  scheduled_date: string;
  scheduled_time: string;
  duration_hours: number;
  service_location: unknown;
  address_text: string;
  hourly_rate: number;
  subtotal: number;
  platform_fee: number;
  total: number;
  status: BookingStatus;
  payment_method: PaymentMethod | null;
  payment_status: PaymentStatus;
  stripe_payment_intent_id: string | null;
  start_otp: string | null;
  completion_otp: string | null;
  start_otp_verified_at: string | null;
  completion_otp_verified_at: string | null;
  contract_pdf_url: string | null;
  customer_signature_url: string | null;
  provider_signature_url: string | null;
  customer_signed_at: string | null;
  provider_signed_at: string | null;
  notes: string | null;
  cancellation_reason: string | null;
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  id: string;
  booking_id: string;
  invoice_number: string;
  pdf_url: string | null;
  issued_at: string;
  paid_at: string | null;
}

export interface Review {
  id: string;
  booking_id: string;
  customer_id: string;
  provider_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  body: string | null;
  data: Record<string, unknown> | null;
  is_read: boolean;
  created_at: string;
}

export interface NearbyProvider {
  provider_id: string;
  user_id: string;
  full_name: string;
  headline: string | null;
  hourly_rate: number;
  rating_avg: number;
  rating_count: number;
  avatar_url: string | null;
  distance_km: number;
}

export interface PortfolioItem {
  id: string;
  provider_id: string;
  image_url: string;
  caption: string | null;
  category_id: string | null;
  sort_order: number;
  created_at: string;
}
