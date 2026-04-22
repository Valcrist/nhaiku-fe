export function parseQuery(q: string): string[] {
  const terms: string[] = [];
  const re = /\w+:"[^"]*"|"([^"]*)"|(\S+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(q)) !== null) terms.push(m[1] ?? m[2] ?? m[0]);
  return terms;
}

export function parseSearchParams(params: { page: string }, url: URL) {
  const page = Math.max(1, Number(params.page) || 1);
  const rawQ = url.searchParams.get('q') ?? '';
  const query = rawQ ? parseQuery(rawQ) : [];
  const sort = url.searchParams.get('sort') ?? 'date';
  return { page, query, sort };
}
