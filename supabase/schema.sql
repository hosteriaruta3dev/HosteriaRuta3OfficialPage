-- Hostería Ruta 3 — esquema de persistencia para Supabase.
-- Ejecutá este script en el SQL Editor: Supabase Dashboard → SQL Editor → New query → Run.

create table if not exists public.rooms (
  id text primary key,
  type text not null check (type in ('habitacion', 'salon')),
  name text not null,
  description text not null default '',
  price integer not null,
  capacity integer not null,
  amenities text[] not null default '{}',
  images text[] not null default '{}',
  active boolean not null default true
);

create table if not exists public.occupancies (
  room_id text not null references public.rooms (id) on delete cascade,
  date text not null check (date ~ '^\d{4}-\d{2}-\d{2}$'),
  primary key (room_id, date)
);

-- Semilla inicial (idempotente: no pisa cambios posteriores).
insert into public.rooms (id, type, name, description, price, capacity, amenities, images, active) values
  (
    'habitacion-simple',
    'habitacion',
    'Habitación Simple',
    'Ideal para una o dos personas que están de paso por la Ruta 3. Cama cómoda, calefacción y todo lo necesario para una buena noche de descanso.',
    80000,
    2,
    array['Cama confortable', 'Ropa de cama y toallas', 'Calefacción', 'Wi-Fi'],
    array['/images/habitacion_camas_simple.jpg'],
    true
  ),
  (
    'habitacion-doble',
    'habitacion',
    'Habitación Doble',
    'Amplia habitación con cama doble para descansar en pareja o en familia chica. Espacio luminoso y equipado para que la parada en la Ruta 3 sea un placer.',
    100000,
    3,
    array['Cama doble', 'Ropa de cama y toallas', 'Calefacción', 'Wi-Fi', 'Smart TV'],
    array['/images/habitacion_cama_doble.jpg'],
    true
  ),
  (
    'habitacion-familiar',
    'habitacion',
    'Habitación Familiar',
    'La más espaciosa: perfecta para grupos o familias que viajan juntos. Comodidad para varios huéspedes con acceso a cocina equipada y cochera techada.',
    150000,
    5,
    array['Capacidad hasta 5 personas', 'Cocina equipada', 'Ropa de cama y toallas', 'Calefacción', 'Wi-Fi'],
    array['/images/habitaciones_exterior.jpg'],
    true
  ),
  (
    'salon-eventos',
    'salon',
    'Salón de Eventos',
    'Festejos y reuniones con capacidad para hasta 40 personas. Vajilla, mesas, sillas y limpieza incluidos, además de espacio al aire libre con cancha y juegos.',
    150000,
    40,
    array['Mesas y sillas', 'Vajilla completa', 'Limpieza incluida', 'Calefacción', 'Espacio al aire libre y cancha', 'Juegos para niños'],
    array['/images/salon_interior_1.jpg', '/images/salon_interior_2.jpg', '/images/salon_exterior_1.jpg', '/images/salon_exterior_2.jpg', '/images/salon_juegos.jpg'],
    true
  )
on conflict (id) do nothing;

-- Seguridad: RLS con lectura pública (rol anon) y escritura exclusiva de service_role.
alter table public.rooms enable row level security;
alter table public.occupancies enable row level security;

drop policy if exists "rooms_public_read" on public.rooms;
create policy "rooms_public_read" on public.rooms
  for select to anon, authenticated using (true);

drop policy if exists "occupancies_public_read" on public.occupancies;
create policy "occupancies_public_read" on public.occupancies
  for select to anon, authenticated using (true);