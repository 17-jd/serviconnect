-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- ENUMS
-- ============================================
CREATE TYPE user_role AS ENUM ('customer', 'provider');
CREATE TYPE booking_status AS ENUM (
    'pending', 'confirmed', 'contract_pending', 'contract_signed',
    'in_progress', 'completed', 'cancelled', 'disputed'
);
CREATE TYPE payment_method AS ENUM ('stripe', 'cash');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'refunded', 'failed');
CREATE TYPE day_of_week AS ENUM ('mon','tue','wed','thu','fri','sat','sun');
CREATE TYPE notification_type AS ENUM (
    'booking_request', 'booking_confirmed', 'booking_cancelled',
    'contract_ready', 'contract_signed', 'otp_start', 'otp_complete',
    'payment_received', 'review_received'
);

-- ============================================
-- PROFILES
-- ============================================
CREATE TABLE public.profiles (
    id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role            user_role NOT NULL,
    full_name       TEXT NOT NULL,
    email           TEXT NOT NULL,
    phone           TEXT,
    phone_verified  BOOLEAN DEFAULT FALSE,
    avatar_url      TEXT,
    created_at      TIMESTAMPTZ DEFAULT now(),
    updated_at      TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- PROVIDER PROFILES
-- ============================================
CREATE TABLE public.provider_profiles (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    bio             TEXT,
    headline        TEXT,
    hourly_rate     INTEGER NOT NULL DEFAULT 0,
    location        GEOGRAPHY(POINT, 4326),
    address_text    TEXT,
    service_radius  INTEGER DEFAULT 25,
    is_verified     BOOLEAN DEFAULT FALSE,
    is_active       BOOLEAN DEFAULT TRUE,
    rating_avg      NUMERIC(3,2) DEFAULT 0,
    rating_count    INTEGER DEFAULT 0,
    stripe_account_id TEXT,
    created_at      TIMESTAMPTZ DEFAULT now(),
    updated_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_provider_location ON public.provider_profiles USING GIST(location);
CREATE INDEX idx_provider_active ON public.provider_profiles(is_active) WHERE is_active = TRUE;

-- ============================================
-- SERVICE CATEGORIES
-- ============================================
CREATE TABLE public.service_categories (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            TEXT NOT NULL UNIQUE,
    slug            TEXT NOT NULL UNIQUE,
    icon            TEXT NOT NULL,
    description     TEXT,
    is_popular      BOOLEAN DEFAULT FALSE,
    sort_order      INTEGER DEFAULT 0,
    created_at      TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- PROVIDER SERVICES
-- ============================================
CREATE TABLE public.provider_services (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id     UUID NOT NULL REFERENCES public.provider_profiles(id) ON DELETE CASCADE,
    category_id     UUID NOT NULL REFERENCES public.service_categories(id) ON DELETE CASCADE,
    custom_rate     INTEGER,
    description     TEXT,
    UNIQUE(provider_id, category_id)
);

-- ============================================
-- PROVIDER AVAILABILITY
-- ============================================
CREATE TABLE public.provider_availability (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id     UUID NOT NULL REFERENCES public.provider_profiles(id) ON DELETE CASCADE,
    day             day_of_week NOT NULL,
    start_time      TIME NOT NULL,
    end_time        TIME NOT NULL,
    is_active       BOOLEAN DEFAULT TRUE,
    UNIQUE(provider_id, day)
);

CREATE TABLE public.provider_availability_overrides (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id     UUID NOT NULL REFERENCES public.provider_profiles(id) ON DELETE CASCADE,
    date            DATE NOT NULL,
    is_available    BOOLEAN DEFAULT FALSE,
    start_time      TIME,
    end_time        TIME,
    UNIQUE(provider_id, date)
);

-- ============================================
-- PORTFOLIO
-- ============================================
CREATE TABLE public.portfolio_items (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id     UUID NOT NULL REFERENCES public.provider_profiles(id) ON DELETE CASCADE,
    image_url       TEXT NOT NULL,
    caption         TEXT,
    category_id     UUID REFERENCES public.service_categories(id),
    sort_order      INTEGER DEFAULT 0,
    created_at      TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- BOOKINGS
-- ============================================
CREATE TABLE public.bookings (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id     UUID NOT NULL REFERENCES public.profiles(id),
    provider_id     UUID NOT NULL REFERENCES public.provider_profiles(id),
    category_id     UUID NOT NULL REFERENCES public.service_categories(id),
    scheduled_date  DATE NOT NULL,
    scheduled_time  TIME NOT NULL,
    duration_hours  INTEGER NOT NULL CHECK (duration_hours IN (1, 2, 3)),
    service_location GEOGRAPHY(POINT, 4326),
    address_text    TEXT NOT NULL,
    hourly_rate     INTEGER NOT NULL,
    subtotal        INTEGER NOT NULL,
    platform_fee    INTEGER NOT NULL,
    total           INTEGER NOT NULL,
    status          booking_status DEFAULT 'pending',
    payment_method  payment_method,
    payment_status  payment_status DEFAULT 'pending',
    stripe_payment_intent_id TEXT,
    start_otp       TEXT,
    completion_otp  TEXT,
    start_otp_verified_at   TIMESTAMPTZ,
    completion_otp_verified_at TIMESTAMPTZ,
    contract_pdf_url        TEXT,
    customer_signature_url  TEXT,
    provider_signature_url  TEXT,
    customer_signed_at      TIMESTAMPTZ,
    provider_signed_at      TIMESTAMPTZ,
    notes           TEXT,
    cancellation_reason TEXT,
    created_at      TIMESTAMPTZ DEFAULT now(),
    updated_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_bookings_customer ON public.bookings(customer_id);
CREATE INDEX idx_bookings_provider ON public.bookings(provider_id);
CREATE INDEX idx_bookings_status ON public.bookings(status);
CREATE INDEX idx_bookings_date ON public.bookings(scheduled_date);

-- ============================================
-- INVOICES
-- ============================================
CREATE TABLE public.invoices (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id      UUID NOT NULL UNIQUE REFERENCES public.bookings(id),
    invoice_number  TEXT NOT NULL UNIQUE,
    pdf_url         TEXT,
    issued_at       TIMESTAMPTZ DEFAULT now(),
    paid_at         TIMESTAMPTZ
);

-- ============================================
-- REVIEWS
-- ============================================
CREATE TABLE public.reviews (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id      UUID NOT NULL UNIQUE REFERENCES public.bookings(id),
    customer_id     UUID NOT NULL REFERENCES public.profiles(id),
    provider_id     UUID NOT NULL REFERENCES public.provider_profiles(id),
    rating          INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment         TEXT,
    created_at      TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- NOTIFICATIONS
-- ============================================
CREATE TABLE public.notifications (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES public.profiles(id),
    type            notification_type NOT NULL,
    title           TEXT NOT NULL,
    body            TEXT,
    data            JSONB,
    is_read         BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_notifications_user ON public.notifications(user_id, is_read);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Find nearby providers
CREATE OR REPLACE FUNCTION find_nearby_providers(
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    radius_km INTEGER DEFAULT 25,
    category_slug TEXT DEFAULT NULL
)
RETURNS TABLE (
    provider_id UUID,
    user_id UUID,
    full_name TEXT,
    headline TEXT,
    hourly_rate INTEGER,
    rating_avg NUMERIC,
    rating_count INTEGER,
    avatar_url TEXT,
    distance_km DOUBLE PRECISION
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        pp.id AS provider_id,
        pp.user_id,
        p.full_name,
        pp.headline,
        pp.hourly_rate,
        pp.rating_avg,
        pp.rating_count,
        p.avatar_url,
        ST_Distance(
            pp.location,
            ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography
        ) / 1000 AS distance_km
    FROM public.provider_profiles pp
    JOIN public.profiles p ON p.id = pp.user_id
    LEFT JOIN public.provider_services ps ON ps.provider_id = pp.id
    LEFT JOIN public.service_categories sc ON sc.id = ps.category_id
    WHERE pp.is_active = TRUE
      AND pp.location IS NOT NULL
      AND ST_DWithin(
          pp.location,
          ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography,
          radius_km * 1000
      )
      AND (category_slug IS NULL OR sc.slug = category_slug)
    GROUP BY pp.id, p.id
    ORDER BY distance_km ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update provider rating
CREATE OR REPLACE FUNCTION update_provider_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.provider_profiles
    SET
        rating_avg = (SELECT AVG(rating) FROM public.reviews WHERE provider_id = NEW.provider_id),
        rating_count = (SELECT COUNT(*) FROM public.reviews WHERE provider_id = NEW.provider_id)
    WHERE id = NEW.provider_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_review_insert
    AFTER INSERT ON public.reviews
    FOR EACH ROW EXECUTE FUNCTION update_provider_rating();

-- Auto-generate invoice number
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TRIGGER AS $$
DECLARE
    next_num INTEGER;
BEGIN
    SELECT COALESCE(MAX(
        CAST(SPLIT_PART(invoice_number, '-', 3) AS INTEGER)
    ), 0) + 1
    INTO next_num
    FROM public.invoices
    WHERE invoice_number LIKE 'INV-' || EXTRACT(YEAR FROM now()) || '-%';

    NEW.invoice_number := 'INV-' || EXTRACT(YEAR FROM now()) || '-' || LPAD(next_num::TEXT, 5, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_invoice_number
    BEFORE INSERT ON public.invoices
    FOR EACH ROW EXECUTE FUNCTION generate_invoice_number();

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER provider_profiles_updated_at BEFORE UPDATE ON public.provider_profiles FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Auth trigger: create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, role, full_name, email, phone)
    VALUES (
        NEW.id,
        (NEW.raw_user_meta_data->>'role')::user_role,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        NEW.email,
        NEW.raw_user_meta_data->>'phone'
    );

    IF (NEW.raw_user_meta_data->>'role') = 'provider' THEN
        INSERT INTO public.provider_profiles (user_id, hourly_rate)
        VALUES (NEW.id, 0);
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
