type UserRef = { full_name: string } | null | undefined;
type UserRefInput = UserRef | UserRef[];

export function relationOne<T>(value: T | T[] | null | undefined): T | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

export function getNewsPublisherName(article: {
  publisher?: UserRefInput;
  author?: UserRefInput;
}) {
  const publisher = relationOne(article.publisher);
  const author = relationOne(article.author);
  return publisher?.full_name ?? author?.full_name ?? null;
}
