-- Supabase Schema for Findly

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Items Table
CREATE TABLE IF NOT EXISTS public.items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL, -- references auth.users(id)
    item_name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    qr_id TEXT UNIQUE NOT NULL,
    is_lost BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Scan Reports Table
CREATE TABLE IF NOT EXISTS public.scan_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_id UUID NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
    message TEXT,
    location JSONB, -- stores lat/lng mapped
    is_visible BOOLEAN DEFAULT true,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scan_reports ENABLE ROW LEVEL SECURITY;

-- Create Policies
-- Relaxed for Demo: Anyone can view and create items
CREATE POLICY "Public handle items" ON public.items
    FOR ALL USING (true) WITH CHECK (true);

-- CREATE POLICY "Users can manage their own items" ON public.items
--     FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Anyone can create a scan report" ON public.scan_reports
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view scan reports" ON public.scan_reports
    FOR SELECT USING (true);

