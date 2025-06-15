create or replace function public.custom_access_token_hook(event jsonb)
returns jsonb
language plpgsql
security definer
stable
as $$
  declare
    claims jsonb;
    user_role public.app_role;
    user_permissions text[];
    v_user_id uuid;
  begin
    RAISE LOG 'Starting custom_access_token_hook for user_id: %', event->>'user_id';
    RAISE LOG 'Initial event: %', event;

    v_user_id := (event->>'user_id')::uuid;
    RAISE LOG 'Parsed user_id: %', v_user_id;

    -- Check if user exists in base table
    DECLARE
      v_user_exists boolean;
    BEGIN
      SELECT EXISTS (
        SELECT 1 FROM public.users WHERE id = v_user_id
      ) INTO v_user_exists;
      RAISE LOG 'User exists in public.users: %', v_user_exists;
    END;

    -- Fetch the user role in the user_roles table with explicit schema
    BEGIN
      SELECT role INTO STRICT user_role 
      FROM public.user_roles 
      WHERE user_id = v_user_id;

      RAISE LOG 'Found user_role: %', user_role;
      
      -- Log all roles for this user (should be only one due to unique constraint)
      RAISE LOG 'All roles for user %:', v_user_id;
      FOR user_role IN (SELECT role FROM public.user_roles WHERE user_id = v_user_id) LOOP
        RAISE LOG '- Role: %', user_role;
      END LOOP;
    EXCEPTION 
      WHEN NO_DATA_FOUND THEN
        RAISE LOG 'No role found for user: %', v_user_id;
      WHEN TOO_MANY_ROWS THEN
        RAISE LOG 'Multiple roles found for user: %', v_user_id;
      WHEN OTHERS THEN
        RAISE LOG 'Error fetching role: %', SQLERRM;
    END;

    -- Fetch permissions if role exists with explicit schema
    if user_role is not null then
      select array_agg(permission::text)
      into user_permissions
      from public.role_permissions
      where role = user_role;
      
      RAISE LOG 'Found permissions for role %: %', user_role, user_permissions;
    end if;

    claims := event->'claims';
    RAISE LOG 'Initial claims: %', claims;

    if user_role is not null then
      -- Set the role claim
      claims := jsonb_set(claims, '{user_role}', to_jsonb(user_role));
      RAISE LOG 'Claims after setting role: %', claims;
    else
      claims := jsonb_set(claims, '{user_role}', 'null');
      RAISE LOG 'No role found, setting null';
    end if;

    -- Set the permissions claim
    if user_permissions is not null then
      claims := jsonb_set(claims, '{user_permissions}', to_jsonb(user_permissions));
      RAISE LOG 'Claims after setting permissions: %', claims;
    else
      claims := jsonb_set(claims, '{user_permissions}', '[]');
      RAISE LOG 'No permissions found, setting empty array';
    end if;

    -- Update the 'claims' object in the original event
    event := jsonb_set(event, '{claims}', claims);
    RAISE LOG 'Final event: %', event;

    -- Return the modified or original event
    return event;
  end;
$$;

-- Даем права на схему
grant usage on schema public to postgres, supabase_auth_admin;

-- Даем права на выполнение функции
grant execute on function public.custom_access_token_hook to supabase_auth_admin;

-- Отзываем права у других ролей
revoke execute on function public.custom_access_token_hook from authenticated, anon, public;

-- Даем права на таблицы
grant select on public.user_roles to postgres, supabase_auth_admin;
grant select on public.role_permissions to postgres, supabase_auth_admin;
grant select on public.users to postgres, supabase_auth_admin;
