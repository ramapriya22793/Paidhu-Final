-- =============================================================================
-- Paidhu Backend – Row Level Security (RLS) Policies  (v2 – Supabase Safe)
-- =============================================================================
--
-- ⚠️  IMPORTANT — HOW THIS WORKS WITH SUPABASE + PGBOUNCER
-- ─────────────────────────────────────────────────────────
-- Your backend connects via PgBouncer (transaction pooling, port 6543).
-- PgBouncer in transaction mode does NOT persist session state, so
-- SET LOCAL / SET SESSION do NOT work reliably.
--
-- SOLUTION:
-- • We use ENABLE ROW LEVEL SECURITY (NOT FORCE ROW LEVEL SECURITY).
-- • Supabase's `postgres` role is a superuser → it automatically bypasses
--   RLS on tables that use ENABLE (not FORCE). Your Express backend runs
--   as `postgres` and will NEVER be blocked.
-- • Policies below protect direct access through the `anon` and
--   `authenticated` Supabase roles (e.g. Supabase JS client, direct API).
--
-- HOW TO RUN:
--   1. Open Supabase Dashboard → SQL Editor
--   2. Paste and run this entire file
--   3. Script is idempotent (safe to re-run)
--
-- WHO IS AFFECTED BY THESE POLICIES:
--   ✅  anon role        → public read-only routes
--   ✅  authenticated    → logged-in Supabase users
--   ❌  postgres role    → NOT affected (bypasses RLS – your backend)
--   ❌  service_role     → NOT affected (Supabase admin operations)
-- =============================================================================


-- ---------------------------------------------------------------------------
-- Helper functions (used by policies for the anon / authenticated roles)
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.current_user_id()
RETURNS integer LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT NULLIF(current_setting('app.user_id', TRUE), '')::integer;
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT COALESCE(NULLIF(current_setting('app.is_admin', TRUE), ''), 'false')::boolean;
$$;

-- Convenience: return true if caller is the postgres superuser (backend)
CREATE OR REPLACE FUNCTION public.is_backend()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT current_user IN ('postgres', 'supabase_admin', 'supabase_auth_admin', 'pgsodium_keyholder');
$$;


-- =============================================================================
-- 1. public.User
-- =============================================================================
ALTER TABLE public."User" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS user_select_own   ON public."User";
DROP POLICY IF EXISTS user_update_own   ON public."User";
DROP POLICY IF EXISTS user_insert_any   ON public."User";
DROP POLICY IF EXISTS admin_all_users   ON public."User";
DROP POLICY IF EXISTS user_backend      ON public."User";

CREATE POLICY admin_all_users ON public."User"
  FOR ALL TO authenticated, anon
  USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY user_select_own ON public."User"
  FOR SELECT TO authenticated, anon
  USING (id = current_user_id());

CREATE POLICY user_update_own ON public."User"
  FOR UPDATE TO authenticated
  USING (id = current_user_id())
  WITH CHECK (id = current_user_id());

-- Anyone may register
CREATE POLICY user_insert_any ON public."User"
  FOR INSERT TO authenticated, anon
  WITH CHECK (true);


-- =============================================================================
-- 2. public.Address
-- =============================================================================
ALTER TABLE public."Address" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS addr_admin_all   ON public."Address";
DROP POLICY IF EXISTS addr_select_own  ON public."Address";
DROP POLICY IF EXISTS addr_insert_own  ON public."Address";
DROP POLICY IF EXISTS addr_update_own  ON public."Address";
DROP POLICY IF EXISTS addr_delete_own  ON public."Address";

CREATE POLICY addr_admin_all ON public."Address"
  FOR ALL TO authenticated, anon
  USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY addr_select_own ON public."Address"
  FOR SELECT TO authenticated, anon
  USING ("userId" = current_user_id());

CREATE POLICY addr_insert_own ON public."Address"
  FOR INSERT TO authenticated, anon
  WITH CHECK ("userId" = current_user_id());

CREATE POLICY addr_update_own ON public."Address"
  FOR UPDATE TO authenticated
  USING ("userId" = current_user_id())
  WITH CHECK ("userId" = current_user_id());

CREATE POLICY addr_delete_own ON public."Address"
  FOR DELETE TO authenticated
  USING ("userId" = current_user_id());


-- =============================================================================
-- 3. public.WishlistItem
-- =============================================================================
ALTER TABLE public."WishlistItem" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS wish_admin_all   ON public."WishlistItem";
DROP POLICY IF EXISTS wish_select_own  ON public."WishlistItem";
DROP POLICY IF EXISTS wish_insert_own  ON public."WishlistItem";
DROP POLICY IF EXISTS wish_delete_own  ON public."WishlistItem";

CREATE POLICY wish_admin_all ON public."WishlistItem"
  FOR ALL TO authenticated, anon
  USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY wish_select_own ON public."WishlistItem"
  FOR SELECT TO authenticated, anon
  USING ("userId" = current_user_id());

CREATE POLICY wish_insert_own ON public."WishlistItem"
  FOR INSERT TO authenticated
  WITH CHECK ("userId" = current_user_id());

CREATE POLICY wish_delete_own ON public."WishlistItem"
  FOR DELETE TO authenticated
  USING ("userId" = current_user_id());


-- =============================================================================
-- 4. public.Category
-- =============================================================================
ALTER TABLE public."Category" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS cat_public_read  ON public."Category";
DROP POLICY IF EXISTS cat_admin_all    ON public."Category";

CREATE POLICY cat_public_read ON public."Category"
  FOR SELECT TO authenticated, anon
  USING (true);

CREATE POLICY cat_admin_all ON public."Category"
  FOR ALL TO authenticated, anon
  USING (is_admin()) WITH CHECK (is_admin());


-- =============================================================================
-- 5. public.Product
-- =============================================================================
ALTER TABLE public."Product" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS prod_public_read ON public."Product";
DROP POLICY IF EXISTS prod_admin_all   ON public."Product";

CREATE POLICY prod_public_read ON public."Product"
  FOR SELECT TO authenticated, anon
  USING (status IN ('ACTIVE', 'PREORDER'));

CREATE POLICY prod_admin_all ON public."Product"
  FOR ALL TO authenticated, anon
  USING (is_admin()) WITH CHECK (is_admin());


-- =============================================================================
-- 6. public.ProductImage
-- =============================================================================
ALTER TABLE public."ProductImage" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS pimg_public_read ON public."ProductImage";
DROP POLICY IF EXISTS pimg_admin_all   ON public."ProductImage";

CREATE POLICY pimg_public_read ON public."ProductImage"
  FOR SELECT TO authenticated, anon
  USING (true);

CREATE POLICY pimg_admin_all ON public."ProductImage"
  FOR ALL TO authenticated, anon
  USING (is_admin()) WITH CHECK (is_admin());


-- =============================================================================
-- 7. public.Order
-- =============================================================================
ALTER TABLE public."Order" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS order_admin_all   ON public."Order";
DROP POLICY IF EXISTS order_select_own  ON public."Order";
DROP POLICY IF EXISTS order_insert_own  ON public."Order";
DROP POLICY IF EXISTS order_update_own  ON public."Order";

CREATE POLICY order_admin_all ON public."Order"
  FOR ALL TO authenticated, anon
  USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY order_select_own ON public."Order"
  FOR SELECT TO authenticated, anon
  USING ("userId" = current_user_id());

CREATE POLICY order_insert_own ON public."Order"
  FOR INSERT TO authenticated, anon
  WITH CHECK ("userId" IS NULL OR "userId" = current_user_id());

CREATE POLICY order_update_own ON public."Order"
  FOR UPDATE TO authenticated
  USING ("userId" = current_user_id())
  WITH CHECK ("userId" = current_user_id());


-- =============================================================================
-- 8. public.OrderItem
-- =============================================================================
ALTER TABLE public."OrderItem" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS oi_admin_all     ON public."OrderItem";
DROP POLICY IF EXISTS oi_select_own    ON public."OrderItem";
DROP POLICY IF EXISTS oi_insert_system ON public."OrderItem";

CREATE POLICY oi_admin_all ON public."OrderItem"
  FOR ALL TO authenticated, anon
  USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY oi_select_own ON public."OrderItem"
  FOR SELECT TO authenticated, anon
  USING (
    EXISTS (
      SELECT 1 FROM public."Order" o
      WHERE o.id = "orderId"
        AND (o."userId" = current_user_id() OR is_admin())
    )
  );

CREATE POLICY oi_insert_system ON public."OrderItem"
  FOR INSERT TO authenticated, anon
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public."Order" o
      WHERE o.id = "orderId"
        AND (o."userId" = current_user_id() OR o."userId" IS NULL OR is_admin())
    )
  );


-- =============================================================================
-- 9. public.CartItem
-- =============================================================================
ALTER TABLE public."CartItem" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS cart_admin_all   ON public."CartItem";
DROP POLICY IF EXISTS cart_select_own  ON public."CartItem";
DROP POLICY IF EXISTS cart_insert_own  ON public."CartItem";
DROP POLICY IF EXISTS cart_update_own  ON public."CartItem";
DROP POLICY IF EXISTS cart_delete_own  ON public."CartItem";

CREATE POLICY cart_admin_all ON public."CartItem"
  FOR ALL TO authenticated, anon
  USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY cart_select_own ON public."CartItem"
  FOR SELECT TO authenticated, anon
  USING ("userId" = current_user_id());

CREATE POLICY cart_insert_own ON public."CartItem"
  FOR INSERT TO authenticated, anon
  WITH CHECK ("userId" IS NULL OR "userId" = current_user_id());

CREATE POLICY cart_update_own ON public."CartItem"
  FOR UPDATE TO authenticated
  USING ("userId" = current_user_id())
  WITH CHECK ("userId" = current_user_id());

CREATE POLICY cart_delete_own ON public."CartItem"
  FOR DELETE TO authenticated
  USING ("userId" = current_user_id());


-- =============================================================================
-- 10. public.Payment
-- =============================================================================
ALTER TABLE public."Payment" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS pay_admin_all    ON public."Payment";
DROP POLICY IF EXISTS pay_select_own   ON public."Payment";
DROP POLICY IF EXISTS pay_insert_own   ON public."Payment";

CREATE POLICY pay_admin_all ON public."Payment"
  FOR ALL TO authenticated, anon
  USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY pay_select_own ON public."Payment"
  FOR SELECT TO authenticated
  USING ("userId" = current_user_id());

CREATE POLICY pay_insert_own ON public."Payment"
  FOR INSERT TO authenticated, anon
  WITH CHECK ("userId" IS NULL OR "userId" = current_user_id());


-- =============================================================================
-- 11. public.Refund
-- =============================================================================
ALTER TABLE public."Refund" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS refund_admin_all  ON public."Refund";
DROP POLICY IF EXISTS refund_select_own ON public."Refund";

CREATE POLICY refund_admin_all ON public."Refund"
  FOR ALL TO authenticated, anon
  USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY refund_select_own ON public."Refund"
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public."Order" o
      WHERE o.id = "orderId" AND o."userId" = current_user_id()
    )
  );


-- =============================================================================
-- 12. public.Coupon
-- =============================================================================
ALTER TABLE public."Coupon" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS coupon_public_read ON public."Coupon";
DROP POLICY IF EXISTS coupon_admin_all   ON public."Coupon";

CREATE POLICY coupon_public_read ON public."Coupon"
  FOR SELECT TO authenticated, anon
  USING ("isActive" = true);

CREATE POLICY coupon_admin_all ON public."Coupon"
  FOR ALL TO authenticated, anon
  USING (is_admin()) WITH CHECK (is_admin());


-- =============================================================================
-- 13. public.Review
-- =============================================================================
ALTER TABLE public."Review" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS review_public_read ON public."Review";
DROP POLICY IF EXISTS review_admin_all   ON public."Review";
DROP POLICY IF EXISTS review_insert_auth ON public."Review";

CREATE POLICY review_public_read ON public."Review"
  FOR SELECT TO authenticated, anon
  USING ("isApproved" = true);

CREATE POLICY review_admin_all ON public."Review"
  FOR ALL TO authenticated, anon
  USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY review_insert_auth ON public."Review"
  FOR INSERT TO authenticated
  WITH CHECK (current_user_id() IS NOT NULL);


-- =============================================================================
-- 14. public.Blog
-- =============================================================================
ALTER TABLE public."Blog" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS blog_public_read ON public."Blog";
DROP POLICY IF EXISTS blog_admin_all   ON public."Blog";

CREATE POLICY blog_public_read ON public."Blog"
  FOR SELECT TO authenticated, anon
  USING (status = 'publish');

CREATE POLICY blog_admin_all ON public."Blog"
  FOR ALL TO authenticated, anon
  USING (is_admin()) WITH CHECK (is_admin());


-- =============================================================================
-- 15. public.SiteSettings
-- =============================================================================
ALTER TABLE public."SiteSettings" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS ss_public_read ON public."SiteSettings";
DROP POLICY IF EXISTS ss_admin_all   ON public."SiteSettings";

CREATE POLICY ss_public_read ON public."SiteSettings"
  FOR SELECT TO authenticated, anon
  USING (true);

CREATE POLICY ss_admin_all ON public."SiteSettings"
  FOR ALL TO authenticated, anon
  USING (is_admin()) WITH CHECK (is_admin());


-- =============================================================================
-- 16. public.Banner
-- =============================================================================
ALTER TABLE public."Banner" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS banner_public_read ON public."Banner";
DROP POLICY IF EXISTS banner_admin_all   ON public."Banner";

CREATE POLICY banner_public_read ON public."Banner"
  FOR SELECT TO authenticated, anon
  USING ("isActive" = true);

CREATE POLICY banner_admin_all ON public."Banner"
  FOR ALL TO authenticated, anon
  USING (is_admin()) WITH CHECK (is_admin());


-- =============================================================================
-- 17. public.SeoData
-- =============================================================================
ALTER TABLE public."SeoData" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS seo_public_read ON public."SeoData";
DROP POLICY IF EXISTS seo_admin_all   ON public."SeoData";

CREATE POLICY seo_public_read ON public."SeoData"
  FOR SELECT TO authenticated, anon
  USING (true);

CREATE POLICY seo_admin_all ON public."SeoData"
  FOR ALL TO authenticated, anon
  USING (is_admin()) WITH CHECK (is_admin());


-- =============================================================================
-- 18. public.DeliveryCharge
-- =============================================================================
ALTER TABLE public."DeliveryCharge" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS dc_public_read ON public."DeliveryCharge";
DROP POLICY IF EXISTS dc_admin_all   ON public."DeliveryCharge";

CREATE POLICY dc_public_read ON public."DeliveryCharge"
  FOR SELECT TO authenticated, anon
  USING ("isActive" = true);

CREATE POLICY dc_admin_all ON public."DeliveryCharge"
  FOR ALL TO authenticated, anon
  USING (is_admin()) WITH CHECK (is_admin());


-- =============================================================================
-- 19. public.TrackingScript
-- =============================================================================
ALTER TABLE public."TrackingScript" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS ts_public_read ON public."TrackingScript";
DROP POLICY IF EXISTS ts_admin_all   ON public."TrackingScript";

CREATE POLICY ts_public_read ON public."TrackingScript"
  FOR SELECT TO authenticated, anon
  USING ("isActive" = true);

CREATE POLICY ts_admin_all ON public."TrackingScript"
  FOR ALL TO authenticated, anon
  USING (is_admin()) WITH CHECK (is_admin());


-- =============================================================================
-- 20. public.LoginHistory
-- =============================================================================
ALTER TABLE public."LoginHistory" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS lh_admin_all   ON public."LoginHistory";
DROP POLICY IF EXISTS lh_select_own  ON public."LoginHistory";
DROP POLICY IF EXISTS lh_insert_any  ON public."LoginHistory";

CREATE POLICY lh_admin_all ON public."LoginHistory"
  FOR ALL TO authenticated, anon
  USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY lh_select_own ON public."LoginHistory"
  FOR SELECT TO authenticated
  USING ("userId" = current_user_id());

CREATE POLICY lh_insert_any ON public."LoginHistory"
  FOR INSERT TO authenticated, anon
  WITH CHECK (true);


-- =============================================================================
-- 21. public.PasswordResetToken
-- =============================================================================
ALTER TABLE public."PasswordResetToken" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS prt_admin_all  ON public."PasswordResetToken";
DROP POLICY IF EXISTS prt_insert_any ON public."PasswordResetToken";
DROP POLICY IF EXISTS prt_select_any ON public."PasswordResetToken";
DROP POLICY IF EXISTS prt_delete_any ON public."PasswordResetToken";

CREATE POLICY prt_admin_all ON public."PasswordResetToken"
  FOR ALL TO authenticated, anon
  USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY prt_insert_any ON public."PasswordResetToken"
  FOR INSERT TO authenticated, anon WITH CHECK (true);

CREATE POLICY prt_select_any ON public."PasswordResetToken"
  FOR SELECT TO authenticated, anon USING (true);

CREATE POLICY prt_delete_any ON public."PasswordResetToken"
  FOR DELETE TO authenticated, anon USING (true);


-- =============================================================================
-- 22. public.NewsletterSubscriber
-- =============================================================================
ALTER TABLE public."NewsletterSubscriber" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS nl_admin_all  ON public."NewsletterSubscriber";
DROP POLICY IF EXISTS nl_insert_any ON public."NewsletterSubscriber";

CREATE POLICY nl_admin_all ON public."NewsletterSubscriber"
  FOR ALL TO authenticated, anon
  USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY nl_insert_any ON public."NewsletterSubscriber"
  FOR INSERT TO authenticated, anon WITH CHECK (true);


-- =============================================================================
-- 23. public.BulkOrderInquiry
-- =============================================================================
ALTER TABLE public."BulkOrderInquiry" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS boi_admin_all  ON public."BulkOrderInquiry";
DROP POLICY IF EXISTS boi_insert_any ON public."BulkOrderInquiry";

CREATE POLICY boi_admin_all ON public."BulkOrderInquiry"
  FOR ALL TO authenticated, anon
  USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY boi_insert_any ON public."BulkOrderInquiry"
  FOR INSERT TO authenticated, anon WITH CHECK (true);


-- =============================================================================
-- 24. public.SaffronGuidance
-- =============================================================================
ALTER TABLE public."SaffronGuidance" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS sg_admin_all  ON public."SaffronGuidance";
DROP POLICY IF EXISTS sg_insert_any ON public."SaffronGuidance";

CREATE POLICY sg_admin_all ON public."SaffronGuidance"
  FOR ALL TO authenticated, anon
  USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY sg_insert_any ON public."SaffronGuidance"
  FOR INSERT TO authenticated, anon WITH CHECK (true);


-- =============================================================================
-- 25. public.TiffinRegistration
-- =============================================================================
ALTER TABLE public."TiffinRegistration" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS tr_admin_all  ON public."TiffinRegistration";
DROP POLICY IF EXISTS tr_insert_any ON public."TiffinRegistration";

CREATE POLICY tr_admin_all ON public."TiffinRegistration"
  FOR ALL TO authenticated, anon
  USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY tr_insert_any ON public."TiffinRegistration"
  FOR INSERT TO authenticated, anon WITH CHECK (true);


-- =============================================================================
-- 26. public.CareerApplication
-- =============================================================================
ALTER TABLE public."CareerApplication" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS ca_admin_all  ON public."CareerApplication";
DROP POLICY IF EXISTS ca_insert_any ON public."CareerApplication";

CREATE POLICY ca_admin_all ON public."CareerApplication"
  FOR ALL TO authenticated, anon
  USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY ca_insert_any ON public."CareerApplication"
  FOR INSERT TO authenticated, anon WITH CHECK (true);


-- =============================================================================
-- VERIFICATION  (run this separately after applying all policies above)
-- =============================================================================
SELECT
  c.relname             AS table_name,
  c.relrowsecurity      AS rls_enabled,
  c.relforcerowsecurity AS rls_forced
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND c.relname IN (
    'User','Address','WishlistItem','Category','Product','ProductImage',
    'Order','OrderItem','CartItem','Payment','Refund','Coupon','Review',
    'Blog','SiteSettings','Banner','SeoData','DeliveryCharge','TrackingScript',
    'LoginHistory','PasswordResetToken','NewsletterSubscriber',
    'BulkOrderInquiry','SaffronGuidance','TiffinRegistration','CareerApplication'
  )
ORDER BY c.relname;
-- Expected for every row: rls_enabled = true, rls_forced = false
-- =============================================================================
