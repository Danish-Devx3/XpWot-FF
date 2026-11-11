-- XPWOT Orders Schema for Supabase PostgreSQL
-- Run this script in the Supabase SQL Editor for production persistence

CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    razorpay_order_id TEXT UNIQUE NOT NULL,
    razorpay_payment_id TEXT UNIQUE,
    customer_details JSONB NOT NULL,
    device_details JSONB NOT NULL,
    package_id TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    payment_status TEXT NOT NULL DEFAULT 'CREATED',
    notification_status TEXT NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for high performance lookup by payment status and order ID
CREATE INDEX IF NOT EXISTS idx_orders_razorpay_order_id ON public.orders(razorpay_order_id);
CREATE INDEX IF NOT EXISTS idx_orders_razorpay_payment_id ON public.orders(razorpay_payment_id);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON public.orders(payment_status);

-- Enable Row Level Security (RLS)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Allow service role full access
CREATE POLICY "Service role full access" ON public.orders
    FOR ALL
    USING (auth.role() = 'service_role');

