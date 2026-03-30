-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Provider Profiles
ALTER TABLE public.provider_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Provider profiles are public" ON public.provider_profiles FOR SELECT USING (true);
CREATE POLICY "Providers can update own profile" ON public.provider_profiles FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Providers can insert own profile" ON public.provider_profiles FOR INSERT WITH CHECK (user_id = auth.uid());

-- Service Categories
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service categories are public" ON public.service_categories FOR SELECT USING (true);

-- Provider Services
ALTER TABLE public.provider_services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Provider services are public" ON public.provider_services FOR SELECT USING (true);
CREATE POLICY "Providers manage own services" ON public.provider_services FOR ALL
    USING (provider_id IN (SELECT id FROM public.provider_profiles WHERE user_id = auth.uid()));

-- Provider Availability
ALTER TABLE public.provider_availability ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Availability is public" ON public.provider_availability FOR SELECT USING (true);
CREATE POLICY "Providers manage own availability" ON public.provider_availability FOR ALL
    USING (provider_id IN (SELECT id FROM public.provider_profiles WHERE user_id = auth.uid()));

-- Provider Availability Overrides
ALTER TABLE public.provider_availability_overrides ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Overrides are public" ON public.provider_availability_overrides FOR SELECT USING (true);
CREATE POLICY "Providers manage own overrides" ON public.provider_availability_overrides FOR ALL
    USING (provider_id IN (SELECT id FROM public.provider_profiles WHERE user_id = auth.uid()));

-- Portfolio Items
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Portfolio is public" ON public.portfolio_items FOR SELECT USING (true);
CREATE POLICY "Providers manage own portfolio" ON public.portfolio_items FOR ALL
    USING (provider_id IN (SELECT id FROM public.provider_profiles WHERE user_id = auth.uid()));

-- Bookings
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own bookings" ON public.bookings FOR SELECT
    USING (
        customer_id = auth.uid() OR
        provider_id IN (SELECT id FROM public.provider_profiles WHERE user_id = auth.uid())
    );
CREATE POLICY "Customers can create bookings" ON public.bookings FOR INSERT
    WITH CHECK (customer_id = auth.uid());
CREATE POLICY "Booking parties can update" ON public.bookings FOR UPDATE
    USING (
        customer_id = auth.uid() OR
        provider_id IN (SELECT id FROM public.provider_profiles WHERE user_id = auth.uid())
    );

-- Invoices
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own invoices" ON public.invoices FOR SELECT
    USING (
        booking_id IN (
            SELECT id FROM public.bookings
            WHERE customer_id = auth.uid() OR
                  provider_id IN (SELECT id FROM public.provider_profiles WHERE user_id = auth.uid())
        )
    );

-- Reviews
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Reviews are public" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Customers can review completed bookings" ON public.reviews FOR INSERT
    WITH CHECK (
        customer_id = auth.uid()
        AND EXISTS (
            SELECT 1 FROM public.bookings
            WHERE id = booking_id AND customer_id = auth.uid() AND status = 'completed'
        )
    );

-- Notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own notifications" ON public.notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (user_id = auth.uid());
