/*
  # Storage Setup for AI Room Designer

  1. Storage Bucket
    - Create `room-images` bucket for storing uploaded room photos
    - Set 10MB file size limit
    - Allow common image formats (JPEG, PNG, WebP)
    - Enable public read access

  2. Security Policies
    - Allow authenticated users to upload images
    - Allow public read access to all images
    - Allow users to delete their own uploaded images
    - Allow users to update their own uploaded images
*/

-- Create the room-images bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'room-images',
  'room-images', 
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist to avoid conflicts
DO $$
BEGIN
  -- Drop upload policy if exists
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Allow authenticated users to upload images'
  ) THEN
    DROP POLICY "Allow authenticated users to upload images" ON storage.objects;
  END IF;

  -- Drop read policy if exists
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Allow public read access to room images'
  ) THEN
    DROP POLICY "Allow public read access to room images" ON storage.objects;
  END IF;

  -- Drop delete policy if exists
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Allow users to delete their own images'
  ) THEN
    DROP POLICY "Allow users to delete their own images" ON storage.objects;
  END IF;

  -- Drop update policy if exists
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Allow users to update their own images'
  ) THEN
    DROP POLICY "Allow users to update their own images" ON storage.objects;
  END IF;
END $$;

-- Create policies for room-images bucket
CREATE POLICY "Allow authenticated users to upload images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'room-images' AND
  auth.uid() IS NOT NULL
);

CREATE POLICY "Allow public read access to room images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'room-images');

CREATE POLICY "Allow users to delete their own images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'room-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Allow users to update their own images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'room-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
)
WITH CHECK (
  bucket_id = 'room-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);