/*
  # Storage bucket setup for AI Room Designer

  1. Storage Configuration
    - Create `room-images` bucket for storing uploaded room photos
    - Set 10MB file size limit
    - Allow JPEG, PNG, WebP image formats
    - Enable public read access for generated URLs

  2. Security Policies
    - Authenticated users can upload images
    - Public read access for all images
    - Users can manage their own uploaded images
    - Folder-based organization by user ID
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
DROP POLICY IF EXISTS "Allow authenticated users to upload images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access to room images" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to delete their own images" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to update their own images" ON storage.objects;

-- Policy to allow authenticated users to upload images
CREATE POLICY "Allow authenticated users to upload images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'room-images' AND
  auth.uid() IS NOT NULL
);

-- Policy to allow public read access to images
CREATE POLICY "Allow public read access to room images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'room-images');

-- Policy to allow users to delete their own uploaded images
CREATE POLICY "Allow users to delete their own images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'room-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy to allow users to update their own uploaded images
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