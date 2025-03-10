/* eslint-disable @typescript-eslint/no-unused-vars -- Remove me */
import 'dotenv/config';
import pg from 'pg';
import express from 'express';
import { ClientError, errorMiddleware } from './lib/index.js';
import { type Entry } from '../client/src/data.js';

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const app = express();

app.get('/api/entry-list', async (req, res, next) => {
  try {
    const sql = `select "title", "notes", "photoUrl" from "entries";`;
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

app.listen(process.env.PORT, () => {
  console.log(`express server listening on port ${process.env.PORT}`);
});
