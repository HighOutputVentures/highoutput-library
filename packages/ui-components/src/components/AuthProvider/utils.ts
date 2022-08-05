export async function postJson<T>(
  url: string,
  postfields: Record<string, unknown>
): Promise<T> {
  const response = await fetch(url, {
    body: JSON.stringify(postfields),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const parsed = await response.json();
  if (!response.ok) throw new Error(parsed.error.message);
  return parsed;
}
