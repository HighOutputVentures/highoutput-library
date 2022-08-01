type Dict = Record<string, unknown>;

type PostJson = <T = unknown>(url: string, postfields: Dict) => Promise<T>;

export const postJson: PostJson = async (u, d) => {
  const response = await fetch(u, {
    body: JSON.stringify(d),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const parsed = await response.json();

  if (!response.ok) throw new Error(parsed.error.message);

  return parsed;
};
