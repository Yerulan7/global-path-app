-- Global Path — seed data (PLACEHOLDER — replace with verified values before showing to users)
-- University names are real; tuition/deadline numbers are illustrative only.
-- last_verified_at is intentionally null until a human verifies each row.

insert into universities (id, name, country, city, website, qs_rank) values
  ('11111111-1111-1111-1111-111111111111', 'Politecnico di Milano',  'IT', 'Milan',   'https://www.polimi.it',  123),
  ('22222222-2222-2222-2222-222222222222', 'University of Bologna',  'IT', 'Bologna', 'https://www.unibo.it',   154),
  ('33333333-3333-3333-3333-333333333333', 'Politecnico di Torino',  'IT', 'Turin',   'https://www.polito.it',  301),
  ('44444444-4444-4444-4444-444444444444', 'Università di Trento',   'IT', 'Trento',  'https://www.unitn.it',   null)
on conflict (id) do nothing;

insert into programs (university_id, name, degree_level, field, language, target_country, tuition_min_eur, tuition_max_eur, ielts_min, gpa_min, source_url, last_verified_at) values
  ('11111111-1111-1111-1111-111111111111', 'BSc Computer Science & Engineering', 'bachelor', 'engineering', 'en', 'IT', 900,  4000, 6.0, 3.0, null, null),
  ('22222222-2222-2222-2222-222222222222', 'BSc Economics & Finance',            'bachelor', 'economics',   'en', 'IT', 900,  3000, 6.0, 3.0, null, null),
  ('33333333-3333-3333-3333-333333333333', 'BSc Electronic Engineering',         'bachelor', 'engineering', 'en', 'IT', 800,  3500, 6.5, 3.0, null, null),
  ('44444444-4444-4444-4444-444444444444', 'BSc Computer Science',               'bachelor', 'engineering', 'en', 'IT', 1000, 2500, 6.0, 3.0, null, null)
on conflict do nothing;

insert into scholarships (target_country, name, amount_min_eur, amount_max_eur, covers, source_url, last_verified_at) values
  ('IT', 'DSU regional scholarship', 4000, 7000, 'both', null, null)
on conflict do nothing;

-- intakes: leave empty until you have verified opens_at / closes_at dates.
-- Do not invent deadline data — accurate deadlines are the core of the value prop.
