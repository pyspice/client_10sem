export interface QueryResult {
  fs: number;
  ECG: number[];
  ICG: number[];
  P: number[];
  Q: number[];
  R: number[];
  S: number[];
  APEP: number[];
  AET: number[];
}

export async function query(json: string): Promise<QueryResult> {
  const request = new Request(`http://localhost:8197/query`, {
    method: 'POST',
    body: json,
    headers: [
      ['Accept', 'application/json'],
      ['Content-Type', 'application/json'],
    ],
  });

  const response = await fetch(request);
  if (response.status < 200 || response.status >= 300) {
    throw new Error(await response.text());
  }

  return await response.json();
}
