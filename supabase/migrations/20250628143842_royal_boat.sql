/*
  # Create room-images storage bucket with RLS policies

  1. Storage Setup
    - Create `room-images` storage bucket
    - Configure bucket to be public for reading
    - Enable RLS on the bucket

  2. Security Policies
    - Allow authenticated users to upload images
    - Allow public read access to uploaded images
    - Allow users to delete their own uploaded images

  3. Notes
    - Images will be publicly readable once uploaded
    - Only authenticated users can upload new images
    - Users can manage their own uploads
*/

-- Create the room-images bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'room-images',
  'room-images', 
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on the storage.objects table (should already be enabled, but ensuring it)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy to allow authenticated users to upload images to room-images bucket
CREATE POLICY "Authenticated users can upload room images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'room-images');

-- Policy to allow public read access to room images
CREATE POLICY "Public read access for room images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'room-images');

-- Policy to allow authenticated users to update their own uploads
CREATE POLICY "Users can update own room images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'room-images' AND auth.uid()::text = owner)
WITH CHECK (bucket_id = 'room-images' AND auth.uid()::text = owner);

-- Policy to allow authenticated users to delete their own uploads
CREATE POLICY "Users can delete own room images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'room-images' AND auth.uid()::text = owner);