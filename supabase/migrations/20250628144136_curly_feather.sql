/*
  # Fix storage bucket and policies for room images

  1. Storage Bucket
    - Create or update `room-images` bucket
    - Set proper file size limits and allowed types
    - Enable public access

  2. Security Policies
    - Allow authenticated users to upload images
    - Allow public read access to images
    - Allow users to manage their own uploads
*/

-- Create the room-images bucket if it doesn't exist
DO $$
BEGIN
  INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  VALUES (
    'room-images',
    'room-images', 
    true,
    10485760, -- 10MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  );
EXCEPTION WHEN unique_violation THEN
  -- Bucket already exists, update its properties
  UPDATE storage.buckets 
  SET 
    public = true,
    file_size_limit = 10485760,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  WHERE id = 'room-images';
END $$;

-- Create policies only if they don't exist
DO $$
BEGIN
  -- Policy for authenticated users to upload images
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Authenticated users can upload room images'
  ) THEN
    CREATE POLICY "Authenticated users can upload room images"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'room-images');
  END IF;

  -- Policy for public read access
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Public read access for room images'
  ) THEN
    CREATE POLICY "Public read access for room images"
    ON storage.objects
    FOR SELECT
    TO public
    USING (bucket_id = 'room-images');
  END IF;

  -- Policy for users to update their own uploads
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Users can update own room images'
  ) THEN
    CREATE POLICY "Users can update own room images"
    ON storage.objects
    FOR UPDATE
    TO authenticated
    USING (bucket_id = 'room-images' AND auth.uid() = owner)
    WITH CHECK (bucket_id = 'room-images' AND auth.uid() = owner);
  END IF;

  -- Policy for users to delete their own uploads
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Users can delete own room images'
  ) THEN
    CREATE POLICY "Users can delete own room images"
    ON storage.objects
    FOR DELETE
    TO authenticated
    USING (bucket_id = 'room-images' AND auth.uid() = owner);
  END IF;
END $$;