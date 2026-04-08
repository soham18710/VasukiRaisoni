-- Supabase Schema for Findly
-- Use this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Items Table
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

-- 2. Scan Reports Table
CREATE TABLE IF NOT EXISTS public.scan_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_id UUID NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
    message TEXT,
    location JSONB, -- stores lat/lng mapped
    is_visible BOOLEAN DEFAULT true,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Messages Table
CREATE TABLE IF NOT EXISTS public.messages (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    item_id TEXT NOT NULL, -- references items.qr_id
    sender_id UUID, -- NULL if guest, otherwise sender auth.users(id)
    sender_name TEXT NOT NULL,
    sender_email TEXT,
    message_text TEXT NOT NULL,
    receiver_id UUID NOT NULL, -- references auth.users(id)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Enable RLS
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scan_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- 5. Clear existing policies to avoid "already exists" errors
DROP POLICY IF EXISTS "Public handle items" ON public.items;
DROP POLICY IF EXISTS "Public can view item by qr_id" ON public.items;
DROP POLICY IF EXISTS "Anyone can create a scan report" ON public.scan_reports;
DROP POLICY IF EXISTS "Anyone can view scan reports" ON public.scan_reports;
DROP POLICY IF EXISTS "Anyone can send a message" ON public.messages;
DROP POLICY IF EXISTS "Anyone can view messages" ON public.messages;

-- 6. Create robust policies
-- Items: Relaxed for Hackathon Demo
CREATE POLICY "Public handle items" ON public.items
    FOR ALL USING (true) WITH CHECK (true);

-- Scan Reports
CREATE POLICY "Anyone can create a scan report" ON public.scan_reports
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view scan reports" ON public.scan_reports
    FOR SELECT USING (true);

-- Messages
CREATE POLICY "Anyone can send a message" ON public.messages
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view messages" ON public.messages
    FOR SELECT USING (true);

CREATE POLICY "Anyone can delete messages" ON public.messages
    FOR DELETE USING (true);
