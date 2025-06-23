/*
  # Create storage bucket for room images

  1. New Storage Bucket
    - `room-images` bucket for storing uploaded room photos
    - Public access for generated URLs
    - File size limits and type restrictions

  2. Security
    - RLS policies for authenticated users
    - File type restrictions (images only)
    - Size limits for uploads
*/

-- Create the storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'room-images',
  'room-images',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp']
);

-- Enable RLS on the bucket
CREATE POLICY "Authenticated users can upload room images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'room-images');

CREATE POLICY "Anyone can view room images"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'room-images');

CREATE POLICY "Users can delete their own room images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'room-images' AND auth.uid()::text = (storage.foldername(name))[1]);