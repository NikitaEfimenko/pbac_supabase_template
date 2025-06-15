DO $$ BEGIN
 CREATE TYPE "public"."app_permission" AS ENUM('entities.create', 'entities.read', 'entities.update', 'entities.delete', 'entities.download', 'entities.reservation.create', 'entities.reservation.cancel');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."app_role" AS ENUM('admin', 'user');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."reservation_status" AS ENUM('pending_payment', 'reserved', 'cancelled', 'expired');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reservations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"entity_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"status" "reservation_status" DEFAULT 'pending_payment' NOT NULL,
	"booking_date" date NOT NULL,
	"start_time" time NOT NULL,
	"end_time" time NOT NULL,
	"total_price" numeric(10, 2) NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "role_permissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"role" "app_role" NOT NULL,
	"permission" "app_permission" NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_roles" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"role" "app_role" NOT NULL
);
--> statement-breakpoint
ALTER TABLE "entities" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "entities" ADD COLUMN "price_seed" numeric(10, 2) DEFAULT '0' NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reservations" ADD CONSTRAINT "reservations_entity_id_entities_id_fk" FOREIGN KEY ("entity_id") REFERENCES "public"."entities"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reservations" ADD CONSTRAINT "reservations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "role_permissions_role_permission_key" ON "role_permissions" USING btree ("role","permission");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "user_roles_user_id_role_key" ON "user_roles" USING btree ("user_id","role");--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "role";


-- Create trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Insert base user record
  INSERT INTO public.users (id)
  VALUES (new.id);

  -- Insert role based on raw_user_meta_data
  INSERT INTO public.user_roles (user_id, role)
  VALUES (
    new.id,
    COALESCE(
      (new.raw_user_meta_data->>'role')::app_role,
      'user'::app_role -- Default role if none specified
    )
  );

  -- Insert default permissions for the role
  INSERT INTO public.role_permissions (role, permission)
  SELECT 
    (new.raw_user_meta_data->>'role')::app_role,
    CASE 
      WHEN (new.raw_user_meta_data->>'role')::text = 'admin' THEN
        unnest(ARRAY[
          'entities.create',
          'entities.read',
          'entities.update',
          'entities.delete',
          'entities.download'
        ]::app_permission[])
      ELSE
        unnest(ARRAY[
          'entities.read',
          'entities.download',
          'entities.reservation.create',
          'entities.reservation.cancel'
        ]::app_permission[])
    END
  ON CONFLICT DO NOTHING;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- Helper function to check if user has permission
CREATE OR REPLACE FUNCTION public.has_permission(required_permission app_permission)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.user_roles ur
    JOIN public.role_permissions rp ON ur.role = rp.role
    WHERE ur.user_id = auth.uid()
    AND rp.permission = required_permission
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entities ENABLE ROW LEVEL SECURITY;

-- Enable RLS for roles tables
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;

-- Enable RLS for permissions
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;

-- Enable RLS
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- Create policies for entities
CREATE POLICY "Users can view all entities"
  ON public.entities FOR SELECT
  TO authenticated
  USING (public.has_permission('entities.read'));

CREATE POLICY "Admins can insert their own entities"
  ON public.entities FOR INSERT
  TO authenticated
  WITH CHECK (
    public.has_permission('entities.create') 
    AND auth.uid() = owner_id
  );

CREATE POLICY "Admins can update their own entities"
  ON public.entities FOR UPDATE
  TO authenticated
  USING (
    public.has_permission('entities.update') 
    AND auth.uid() = owner_id
  )
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Admins can delete their own entities"
  ON public.entities FOR DELETE
  TO authenticated
  USING (
    public.has_permission('entities.delete') 
    AND auth.uid() = owner_id
  );

-- Only allow read access for authenticated users to see their own role
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Block all modifications through API
CREATE POLICY "Block role modifications through API"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (false)
  WITH CHECK (false);

-- Block all modifications for permissions through API
CREATE POLICY "Block permission modifications through API"
  ON public.role_permissions FOR ALL
  TO authenticated
  USING (false)
  WITH CHECK (false);

-- Allow read access to role permissions for authenticated users
CREATE POLICY "Users can view role permissions"
  ON public.role_permissions FOR SELECT
  TO authenticated
  USING (true);

-- Allow read access to all authenticated users
CREATE POLICY "Allow read access to permissions"
  ON public.permissions FOR SELECT
  TO authenticated
  USING (true);

-- Block all modifications through API
CREATE POLICY "Block permissions modifications through API"
  ON public.permissions FOR ALL
  TO authenticated
  USING (false)
  WITH CHECK (false);

-- Политики для чтения резерваций
CREATE POLICY "Пользователи могут видеть свои резервации"
ON reservations FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Админы могут видеть резервации своих сущностей"
ON reservations FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM entities 
    WHERE entities.id = reservations.entity_id 
    AND entities.owner_id = auth.uid()
  )
);

-- Политики для создания резерваций
CREATE POLICY "Пользователи могут создавать резервации"
ON reservations FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id 
  AND NOT EXISTS (
    SELECT 1 FROM reservations r 
    WHERE r.entity_id = entity_id 
    AND r.status IN ('pending_payment', 'reserved')
    AND r.booking_date = booking_date
    AND (
      (start_time BETWEEN r.start_time AND r.end_time)
      OR (end_time BETWEEN r.start_time AND r.end_time)
      OR (start_time <= r.start_time AND end_time >= r.end_time)
    )
  )
);

-- Политики для обновления резерваций
CREATE POLICY "Пользователи могут обновлять свои резервации"
ON reservations FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (
  status IN ('cancelled') 
  AND EXISTS (
    SELECT 1 FROM reservations 
    WHERE id = id 
    AND status = 'pending_payment'
  )
); 
