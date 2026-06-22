import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

router.get('/', async (req, res) => {
  const { targetCountry, field, degreeLevel } = req.query;

  const where = [];
  const params = [];
  if (targetCountry) { params.push(targetCountry); where.push(`p.target_country = $${params.length}`); }
  if (field)         { params.push(field);          where.push(`p.field = $${params.length}`); }
  if (degreeLevel)   { params.push(degreeLevel);    where.push(`p.degree_level = $${params.length}`); }

  const sql = `
    select p.*, u.name as university_name, u.city, u.country, u.qs_rank
    from programs p
    join universities u on u.id = p.university_id
    ${where.length ? 'where ' + where.join(' and ') : ''}
    order by u.qs_rank nulls last
    limit 100
  `;

  try {
    const { rows } = await pool.query(sql, params);
    res.json(rows);
  } catch (e) {
    console.error('GET /api/programs failed:', e.message);
    res.status(500).json({ error: 'failed to load programs' });
  }
});

export default router;
