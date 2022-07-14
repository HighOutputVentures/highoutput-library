/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-spaced-func, func-call-spacing */
import * as R from 'ramda';

const operators = new Set([
  'eq',
  'ne',
  'gt',
  'gte',
  'lt',
  'lte',
  'in',
  'nin',
  'overlaps',
  'includesAny',
  'excludesAll',
  'startsWith',
  'contains',
]);

function escape(value: string) {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

export function convertQueryOperatorToMongooseQuery<T = any>(queryOperator: Record<string, T>) {
  return R.compose<
    Record<string, T>[],
    [string, T][],
    ([string, T] | [string, RegExp] | null)[],
    any,
    Record<string, T>
  >(
    R.fromPairs,
    R.filter<any>(R.identity),
    R.map(([key, value]) => {
      if (!operators.has(key)) {
        return null;
      }

      if (key === 'startsWith') {
        const regex = new RegExp(
          `^${escape(value as unknown as string)}.*$`,
          'i',
        );

        return ['$regex', regex];
      }

      if (key === 'contains') {
        const regex = new RegExp(
          `^.*${escape(value as unknown as string)}.*$`,
          'i',
        );

        return ['$regex', regex];
      }

      if (key === 'overlaps' || key === 'includesAny') {
        return ['$in', value];
      }

      if (key === 'excludesAll') {
        return ['$nin', value];
      }

      return [`$${key}`, value];
    }),
    R.toPairs,
  )(queryOperator);
}
