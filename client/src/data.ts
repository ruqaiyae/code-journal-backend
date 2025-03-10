export type Entry = {
  entryId?: number;
  title: string;
  notes: string;
  photoUrl: string;
};

// type Data = {
//   entries: Entry[];
//   nextEntryId: number;
// };

// const dataKey = 'code-journal-data';

// function readData(): Data {
//   let data: Data;
//   const localData = localStorage.getItem(dataKey);
//   if (localData) {
//     data = JSON.parse(localData) as Data;
//   } else {
//     data = {
//       entries: [],
//       nextEntryId: 1,
//     };
//   }
//   return data;
// }

export async function readEntries(): Promise<Entry[]> {
  const response = await fetch('/api/entry-list');
  if (!response.ok) {
    throw new Error(`response status: ${response.status}`);
  }

  return (await response.json()) as Entry[];
}

export async function readEntry(entryId: number): Promise<Entry | undefined> {
  const response = await fetch(`/api/details/${entryId}`);
  if (!response.ok) {
    throw new Error(`response status: ${response.status}`);
  }
  return (await response.json()) as Entry;
}

export async function addEntry(entry: Entry): Promise<Entry> {
  const req = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(entry),
  };
  const res = await fetch('/api/entry', req);
  if (!res.ok) throw new Error(`fetch Error ${res.status}`);
  return (await res.json()) as Entry;
}

export async function updateEntry(entry: Entry): Promise<Entry> {
  const req = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(entry),
  };
  const res = await fetch(`/api/details/${entry.entryId}`, req);
  if (!res.ok) throw new Error(`fetch Error ${res.status}`);
  return (await res.json()) as Entry;
}

export async function removeEntry(entryId: number): Promise<void> {
  const req = {
    method: 'DELETE',
  };
  const response = await fetch(`/api/details/${entryId}`, req);
  if (!response.ok) {
    throw new Error(`response status: ${response.status}`);
  }
}
