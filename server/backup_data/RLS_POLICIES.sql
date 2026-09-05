-- ==========================================
-- ROW LEVEL SECURITY (RLS) & POLICIES EXPORT
-- ==========================================

ALTER TABLE public."Address" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Banner" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Blog" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."BulkOrderInquiry" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."CareerApplication" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."CartItem" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Category" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Coupon" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."DeliveryCharge" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."LoginHistory" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."NewsletterSubscriber" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Order" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."OrderItem" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."PasswordResetToken" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Payment" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Product" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."ProductImage" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."ProductSeo" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Refund" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Review" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."SaffronGuidance" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."SeoData" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."SiteSettings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."TiffinRegistration" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."TrackingScript" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."WishlistItem" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."_prisma_migrations" ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- POLICIES DEFINITIONS
-- ==========================================

CREATE POLICY "Allow public select access to Banner" ON public."Banner"
  AS PERMISSIVE
  FOR SELECT
  TO public
  USING (true)
;

CREATE POLICY "Allow public read access" ON public."Category"
  AS PERMISSIVE
  FOR SELECT
  TO public
  USING (true)
;

CREATE POLICY "Allow public read access" ON public."Product"
  AS PERMISSIVE
  FOR SELECT
  TO public
  USING (true)
;

CREATE POLICY "Allow Public Access 1jhziis_0" ON storage."objects"
  AS PERMISSIVE
  FOR SELECT
  TO public
  USING ((bucket_id = 'Products'::text))
;

CREATE POLICY "Allow Public Access 1jhziis_1" ON storage."objects"
  AS PERMISSIVE
  FOR INSERT
  TO public
  WITH CHECK ((bucket_id = 'Products'::text))
;

CREATE POLICY "Allow Public Access 1jhziis_2" ON storage."objects"
  AS PERMISSIVE
  FOR UPDATE
  TO public
  USING ((bucket_id = 'Products'::text))
;

CREATE POLICY "Allow Public Access 1jhziis_3" ON storage."objects"
  AS PERMISSIVE
  FOR DELETE
  TO public
  USING ((bucket_id = 'Products'::text))
;

CREATE POLICY "Public Delete" ON storage."objects"
  AS PERMISSIVE
  FOR DELETE
  TO public
  USING ((bucket_id = 'landing-videos'::text))
;

CREATE POLICY "Public Insert" ON storage."objects"
  AS PERMISSIVE
  FOR INSERT
  TO public
  WITH CHECK ((bucket_id = 'landing-videos'::text))
;

CREATE POLICY "Public Select" ON storage."objects"
  AS PERMISSIVE
  FOR SELECT
  TO public
  USING ((bucket_id = 'landing-videos'::text))
;

CREATE POLICY "Public Update" ON storage."objects"
  AS PERMISSIVE
  FOR UPDATE
  TO public
  USING ((bucket_id = 'landing-videos'::text))
  WITH CHECK ((bucket_id = 'landing-videos'::text))
;

