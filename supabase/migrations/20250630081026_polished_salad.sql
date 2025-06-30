/*
  # Create room-images storage bucket and policies

  1. Storage Setup
    - Create 'room-images' storage bucket if it doesn't exist
    - Configure bucket to be public for reading
    
  2. Security Policies
    - Allow authenticated users to upload images (INSERT)
    - Allow public read access to images (SELECT)
    - Allow users to delete their own uploaded images (DELETE)
    
  3. Notes
    - Images will be publicly readable once uploaded
    - Only authenticated users can upload new images
    - Users can delete images they uploaded
    - Uses conditional policy creation to avoid conflicts
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

-- Create policies only if they don't already exist
DO $$
BEGIN
  -- Policy to allow authenticated users to upload images
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Allow authenticated users to upload images'
  ) THEN
    CREATE POLICY "Allow authenticated users to upload images"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (
      bucket_id = 'room-images' AND
      auth.uid() IS NOT NULL
    );
  END IF;

  -- Policy to allow public read access to images
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Allow public read access to room images'
  ) THEN
    CREATE POLICY "Allow public read access to room images"
    ON storage.objects
    FOR SELECT
    TO public
    USING (bucket_id = 'room-images');
  END IF;

  -- Policy to allow users to delete their own uploaded images
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Allow users to delete their own images'
  ) THEN
    CREATE POLICY "Allow users to delete their own images"
    ON storage.objects
    FOR DELETE
    TO authenticated
    USING (
      bucket_id = 'room-images' AND
      auth.uid()::text = (storage.foldername(name))[1]
    );
  END IF;

  -- Policy to allow users to update their own uploaded images
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Allow users to update their own images'
  ) THEN
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
  END IF;
END $$;