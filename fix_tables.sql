ALTER TABLE public.consoles ADD COLUMN IF NOT EXISTS video text;
ALTER TABLE public.games ADD COLUMN IF NOT EXISTS video text;
ALTER TABLE public.pedido_items ADD COLUMN IF NOT EXISTS image text;
ALTER TABLE public.pedido_messages ADD COLUMN IF NOT EXISTS created_at timestamp with time zone DEFAULT now();
ALTER TABLE public.solicitacoes ADD COLUMN IF NOT EXISTS client_email text;
