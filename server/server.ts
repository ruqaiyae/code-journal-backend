/* eslint-disable @typescript-eslint/no-unused-vars -- Remove me */
import 'dotenv/config';
import pg from 'pg';
import express, { application } from 'express';
import { ClientError, errorMiddleware } from './lib/index.js';
import { type Entry } from '../client/src/data.js';

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const app = express();

app.use(express.json());

app.get('/api/entry-list', async (req, res, next) => {
  try {
    const sql = `select * from "entries";`;
    const result = await db.query<Entry>(sql); // as Entry
    const entry = result.rows;
    if (!entry) {
      throw new ClientError(404, 'No entries are available');
    }
    res.json(entry);
  } catch (error) {
    next(error);
  }
});

app.get('/api/details/:entryId', async (req, res, next) => {
  try {
    const { entryId } = req.params;
    if (!entryId) throw new ClientError(400, 'please provide entryId.');
    const sql = `select * from "entries"
                where "entryId" = $1;`;
    const result = await db.query<Entry>(sql, [entryId]); // as Entry
    const entry = result.rows[0];
    if (!entry) {
      throw new ClientError(404, 'No entries are available');
    }
    res.json(entry);
  } catch (error) {
    next(error);
  }
});

app.post('/api/entry', async (req, res, next) => {
  try {
    const { title, notes, photoUrl } = req.body;
    if (!title) throw new ClientError(400, 'please provide title.');
    if (!notes) throw new ClientError(400, 'please provide notes.');
    if (!photoUrl) throw new ClientError(400, 'please provide photoUrl.');
    const sql = `insert into "entries" ("title", "notes", "photoUrl")
      values ($1,$2,$3)
      returning * `;
    const params = [title, notes, photoUrl];
    const result = await db.query<Entry>(sql, params); // as Entry
    console.log(result);
    const entry = result.rows[0];
    if (!entry) {
      throw new ClientError(404, 'No entries are available');
    }
    res.json(entry);
  } catch (error) {
    next(error);
  }
});

app.put('/api/details/:entryId', async (req, res, next) => {
  try {
    const { title, notes, photoUrl } = req.body;
    const { entryId } = req.params;
    if (!title) throw new ClientError(400, 'please provide title.');
    if (!notes) throw new ClientError(400, 'please provide notes.');
    if (!photoUrl) throw new ClientError(400, 'please provide photoUrl.');
    if (!entryId) throw new ClientError(400, 'please provide entryId.');
    const sql = `update "entries"
    set "title" = $1, "notes" = $2, "photoUrl" = $3
    where "entryId" = $4
    returning * ;`;
    const params = [title, notes, photoUrl, entryId];
    const result = await db.query<Entry>(sql, params); // as Entry
    const entry = result.rows[0];
    if (!entry) {
      throw new ClientError(404, 'No entries are available');
    }
    res.json(entry);
  } catch (error) {
    next(error);
  }
});

app.delete('/api/details/:entryId', async (req, res, next) => {
  try {
    const { entryId } = req.params;
    if (!entryId) throw new ClientError(400, 'please provide entryId.');
    const sql = `delete from "entries"
    where "entryId" = $1
    returning * ;`;
    const result = await db.query<Entry>(sql, [entryId]);
    console.log(result);
    const entry = result.rows[0];
    if (!entry) {
      throw new ClientError(404, 'No entries are available');
    }
    res.json(entry);
  } catch (error) {
    next(error);
  }
});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  console.log(`express server listening on port ${process.env.PORT}`);
});
