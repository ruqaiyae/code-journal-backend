import { User } from './pages/RegistrationForm';

export type Entry = {
  entryId?: number;
  title: string;
  notes: string;
  photoUrl: string;
};

const authKey = 'um.auth';
type Auth = {
  user: User;
  token: string;
};
export function saveAuth(user: User, token: string): void {
  const auth: Auth = { user, token };
  localStorage.setItem(authKey, JSON.stringify(auth));
}
export function removeAuth(): void {
  localStorage.removeItem(authKey);
}

export function readUser(): User | undefined {
  const auth = localStorage.getItem(authKey);
  if (!auth) return undefined;
  return (JSON.parse(auth) as Auth).user;
}

export function readToken(): string | undefined {
  const auth = localStorage.getItem(authKey);
  if (!auth) return undefined;
  return (JSON.parse(auth) as Auth).token;
}
export async function readEntries(): Promise<Entry[]> {
  const bear = readToken();
  const req = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${bear}`,
    },
  };
  const response = await fetch('/api/entry-list', req);
  if (!response.ok) {
    throw new Error(`response status: ${response.status}`);
  }

  return (await response.json()) as Entry[];
}

export async function readEntry(entryId: number): Promise<Entry | undefined> {
  const bear = readToken();
  const req = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${bear}`,
    },
  };
  const response = await fetch(`/api/details/${entryId}`, req);
  if (!response.ok) {
    throw new Error(`response status: ${response.status}`);
  }
  return (await response.json()) as Entry;
}

export async function addEntry(entry: Entry): Promise<Entry> {
  const bear = readToken();
  const req = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${bear}`,
    },
    body: JSON.stringify(entry),
  };
  const res = await fetch('/api/entry', req);
  if (!res.ok) throw new Error(`fetch Error ${res.status}`);
  return (await res.json()) as Entry;
}

export async function updateEntry(entry: Entry): Promise<Entry> {
  const bear = readToken();
  const req = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${bear}`,
    },
    body: JSON.stringify(entry),
  };
  const res = await fetch(`/api/details/${entry.entryId}`, req);
  if (!res.ok) throw new Error(`fetch Error ${res.status}`);
  return (await res.json()) as Entry;
}

export async function removeEntry(entryId: number): Promise<void> {
  const bear = readToken();
  const req = {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${bear}`,
    },
  };
  const response = await fetch(`/api/details/${entryId}`, req);
  if (!response.ok) {
    throw new Error(`response status: ${response.status}`);
  }
}
