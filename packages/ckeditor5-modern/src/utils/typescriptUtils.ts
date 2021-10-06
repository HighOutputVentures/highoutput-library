/** Type workaround for https://github.com/Microsoft/TypeScript/issues/7294#issuecomment-465794460 */
type ArrayElem<A> = A extends Array<infer Elem> ? Elem : never

export function elemT<T>(array: T): Array<ArrayElem<T>> {
  return array as any
}

/** 2021 update https://stackoverflow.com/questions/43118692/typescript-filter-out-nulls-from-an-array */
export function notEmpty<TValue>(value: TValue | null | undefined | boolean): value is TValue {
  if (value === null || value === undefined || value === false) return false;
  return true;
}
