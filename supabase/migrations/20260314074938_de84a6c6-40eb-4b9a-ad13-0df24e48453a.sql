
-- Create storage bucket for booking document uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('booking-docs', 'booking-docs', true);

-- Allow anyone to upload to booking-docs bucket
CREATE POLICY "Allow public uploads to booking-docs" ON storage.objects
  FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id = 'booking-docs');

-- Allow public read access
CREATE POLICY "Allow public read from booking-docs" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'booking-docs');
