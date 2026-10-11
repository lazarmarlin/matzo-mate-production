export type KilnRecord = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  updatedAt: string;
};

const startedAt = Date.now();

function stamp(iso: string, title: string, body: string): KilnRecord {
  return { id: crypto.randomUUID().slice(0, 8), title, body, createdAt: iso, updatedAt: iso };
}

const seedTime = "2026-04-02T15:00:00.000Z";

const records: KilnRecord[] = [
  stamp(seedTime, "Bisque fire", "Cone 06. Bowls came out clean. No cracks."),
  stamp(seedTime, "Glaze test", "Lime ash ran. Keep it off the foot ring."),
  stamp(seedTime, "Shelf map", "Top shelf is tests. Bottom shelf is orders."),
];

export function uptimeSeconds(): number {
  return Math.round((Date.now() - startedAt) / 1000);
}

export function listRecords(query: string): KilnRecord[] {
  const q = query.trim().toLowerCase();
  const rows = q
    ? records.filter(
        (row) => row.title.toLowerCase().includes(q) || row.body.toLowerCase().includes(q),
      )
    : records;
  return rows.map((row) => ({ ...row }));
}

export function findRecord(id: string): KilnRecord | undefined {
  const row = records.find((item) => item.id === id);
  return row ? { ...row } : undefined;
}

export function createRecord(title: string, body: string): KilnRecord {
  const now = new Date().toISOString();
  const row: KilnRecord = {
    id: crypto.randomUUID().slice(0, 8),
    title,
    body,
    createdAt: now,
    updatedAt: now,
  };
  records.unshift(row);
  return { ...row };
}

export function replaceRecord(
  id: string,
  title: string,
  body: string,
): KilnRecord | undefined {
  const row = records.find((item) => item.id === id);
  if (!row) return undefined;
  row.title = title;
  row.body = body;
  row.updatedAt = new Date().toISOString();
  return { ...row };
}

export function deleteRecord(id: string): boolean {
  const index = records.findIndex((item) => item.id === id);
  if (index === -1) return false;
  records.splice(index, 1);
  return true;
}
