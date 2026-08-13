# Supabase setup

The application works with local content until a Supabase project is available.

## Remote project checklist

1. Create a Supabase project.
2. Run the SQL migration in `migrations/202608120001_initial_content.sql`.
3. Copy `.env.example` to `.env.local` and fill the Supabase URL and publishable key.
4. Set `ADMIN_EMAIL` to the only email initially allowed into the administration panel.
5. Keep `CONTENT_SOURCE=local` while validating authentication and importing data.
6. In Authentication > Users, create the administrator with the same email configured in
   `ADMIN_EMAIL`, a strong password, and a confirmed email.
7. Add that Auth user to `public.admin_users` using the SQL editor:

   ```sql
   insert into public.admin_users (user_id)
   select id from auth.users where email = 'your-admin@email.com';
   ```

8. Import the current local content.
9. Change `CONTENT_SOURCE=supabase` only after comparing the remote data with the local pages.

Never expose `SUPABASE_SERVICE_ROLE_KEY` through a variable prefixed with `NEXT_PUBLIC_`.
