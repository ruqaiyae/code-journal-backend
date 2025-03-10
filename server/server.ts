/* eslint-disable @typescript-eslint/no-unused-vars -- Remove me */
import 'dotenv/config';
import pg from 'pg';
import express, { application } from 'express';
import { authMiddleware, ClientError, errorMiddleware } from './lib/index.js';
import { type Entry } from '../client/src/data.js';
import jwt, { TokenExpiredError } from 'jsonwebtoken';
import { verify } from 'crypto';
import argon2, { hash } from 'argon2';

type User = {
  userId: number;
  username: string;
  hashedPassword: string;
};
type Auth = {
  username: string;
  password: string;
};

const hashKey = process.env.TOKEN_SECRET;
if (!hashKey) throw new Error('TOKEN_SECRET not found in .env');

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const app = express();

app.use(express.json());

app.post('/api/auth/sign-up', async (req, res, next) => {
  console.log('got here');
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      throw new ClientError(400, 'username and password are required fields');
    }
    const hashedPassword = await argon2.hash(password);
    const sql = `
     insert into "users"("username","hashedPassword")
     values ($1, $2)
     returning "userId","username","createdAt"`;
    const params = [username, hashedPassword];
    const result = await db.query(sql, params);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

app.post('/api/auth/sign-in', async (req, res, next) => {
  try {
    const { username, password } = req.body as Partial<Auth>;
    if (!username || !password) {
      throw new ClientError(401, 'invalid login');
    }

    const sql = `
      select "userId", "hashedPassword"
      from "users"
      where "username" = $1
      `;
    const params = [username];
    const result = await db.query(sql, params);
    const user = result.rows[0];
    if (!user) throw new ClientError(401, 'invalid login information.');

    const passwordValid = await argon2.verify(user.hashedPassword, password);

    if (!passwordValid) throw new ClientError(401, 'invalid login error');
    if (passwordValid) {
      const payload = {
        userId: user.userId,
        username: user.username,
      };
      const token = jwt.sign(payload, hashKey);
      res.status(200).json({
        user: payload,
        token,
      });
    }
  } catch (err) {
    next(err);
  }
});

app.get('/api/entry-list', authMiddleware, async (req, res, next) => {
  try {
    const sql = `select *
                from "entries"
                where "userId" = $1;`;
    const result = await db.query<Entry>(sql, [req.user?.userId]); // as Entry
    const entry = result.rows;
    if (!entry) {
      throw new ClientError(404, 'No entries are available');
    }
    res.json(entry);
  } catch (error) {
    next(error);
  }
});

app.get('/api/details/:entryId', authMiddleware, async (req, res, next) => {
  try {
    const { entryId } = req.params;
    if (!entryId) throw new ClientError(400, 'please provide entryId.');
    const sql = `select * from "entries"
                where "entryId" = $1 and "userId" = $2;`;
    const result = await db.query<Entry>(sql, [entryId, req.user?.userId]); // as Entry
    const entry = result.rows[0];
    if (!entry) {
      throw new ClientError(404, 'No entries are available');
    }
    res.json(entry);
  } catch (error) {
    next(error);
  }
});

app.post('/api/entry', authMiddleware, async (req, res, next) => {
  try {
    const { title, notes, photoUrl } = req.body;
    if (!title) throw new ClientError(400, 'please provide title.');
    if (!notes) throw new ClientError(400, 'please provide notes.');
    if (!photoUrl) throw new ClientError(400, 'please provide photoUrl.');
    const sql = `insert into "entries" ("title", "notes", "photoUrl", "userId")
      values ($1,$2,$3, $4)
      returning * `;
    const params = [title, notes, photoUrl, req.user?.userId];
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

app.put('/api/details/:entryId', authMiddleware, async (req, res, next) => {
  try {
    const { title, notes, photoUrl } = req.body;
    const { entryId } = req.params;
    if (!title) throw new ClientError(400, 'please provide title.');
    if (!notes) throw new ClientError(400, 'please provide notes.');
    if (!photoUrl) throw new ClientError(400, 'please provide photoUrl.');
    if (!entryId) throw new ClientError(400, 'please provide entryId.');
    const sql = `update "entries"
    set "title" = $1, "notes" = $2, "photoUrl" = $3
    where "entryId" = $4 and "userId" = $5
    returning * ;`;
    const params = [title, notes, photoUrl, entryId, req.user?.userId];
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

app.delete('/api/details/:entryId', authMiddleware, async (req, res, next) => {
  try {
    const { entryId } = req.params;
    if (!entryId) throw new ClientError(400, 'please provide entryId.');
    const sql = `delete from "entries"
    where "entryId" = $1 and "userId" = $2
    returning * ;`;
    const result = await db.query<Entry>(sql, [entryId, req.user?.userId]);
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
