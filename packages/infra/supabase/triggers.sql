-- Create trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  v_role public.app_role;
BEGIN
  -- Debug logging
  RAISE LOG 'Starting handle_new_user for id: %, email: %, meta: %', 
    new.id, 
    new.email,
    new.raw_user_meta_data;

  -- Determine role with safer type casting
  BEGIN
    RAISE LOG 'Raw metadata role value: %', new.raw_user_meta_data->>'role';
    
    IF new.raw_user_meta_data->>'role' IS NOT NULL THEN
      v_role := (new.raw_user_meta_data->>'role')::public.app_role;
      RAISE LOG 'Role from metadata: %', v_role;
    ELSE
      v_role := 'user'::public.app_role;
      RAISE LOG 'Using default role: %', v_role;
    END IF;
  EXCEPTION WHEN OTHERS THEN
    RAISE LOG 'Error casting role: %, using default', SQLERRM;
    v_role := 'user'::public.app_role;
  END;

  -- Insert role
  BEGIN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (new.id, v_role)
    ON CONFLICT (user_id) DO UPDATE 
    SET role = EXCLUDED.role;
    RAISE LOG 'Successfully inserted/updated role % for user: %', v_role, new.id;
  EXCEPTION WHEN OTHERS THEN
    RAISE LOG 'Error inserting role: %', SQLERRM;
    RETURN new;
  END;

  -- Verify role was set
  DECLARE
    v_check_role public.app_role;
  BEGIN
    SELECT role INTO v_check_role FROM public.user_roles WHERE user_id = new.id;
    RAISE LOG 'Verification - Role in database for user %: %', new.id, v_check_role;
  END;

  -- Insert permissions based on role
  IF v_role = 'admin' THEN
    INSERT INTO public.role_permissions (role, permission)
    VALUES
      (v_role, 'entities.create'),
      (v_role, 'entities.read'),
      (v_role, 'entities.update'),
      (v_role, 'entities.delete'),
      (v_role, 'entities.download')
    ON CONFLICT DO NOTHING;
    
    RAISE LOG 'Admin permissions assigned for user: %', new.id;
  ELSE
    INSERT INTO public.role_permissions (role, permission)
    VALUES
      (v_role, 'entities.read'),
      (v_role, 'entities.download'),
      (v_role, 'entities.reservation.create'),
      (v_role, 'entities.reservation.cancel')
    ON CONFLICT DO NOTHING;
    
    RAISE LOG 'User permissions assigned for user: %', new.id;
  END IF;

  RETURN new;
EXCEPTION WHEN OTHERS THEN
  RAISE LOG 'Error in handle_new_user: %', SQLERRM;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Add unique constraint to user_roles if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'user_roles_user_id_key'
  ) THEN
    ALTER TABLE public.user_roles ADD CONSTRAINT user_roles_user_id_key UNIQUE (user_id);
  END IF;
END $$;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO postgres, service_role;

-- RLS Policies
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DO $$ 
BEGIN
  -- Drop existing policies
  DROP POLICY IF EXISTS "Allow full access to service_role" ON public.user_roles;
  DROP POLICY IF EXISTS "Allow full access to service_role" ON public.role_permissions;
  DROP POLICY IF EXISTS "Allow users to read their own roles" ON public.user_roles;
  DROP POLICY IF EXISTS "Allow users to read role permissions" ON public.role_permissions;

  -- Create policies
  CREATE POLICY "Allow full access to service_role"
  ON public.user_roles FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

  CREATE POLICY "Allow full access to service_role"
  ON public.role_permissions FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

  CREATE POLICY "Allow users to read their own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

  CREATE POLICY "Allow users to read role permissions"
  ON public.role_permissions FOR SELECT
  TO authenticated
  USING (true);
END $$;



