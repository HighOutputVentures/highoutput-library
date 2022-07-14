import { convertQueryOperatorToMongooseQuery } from './convert-query-operator-to-mongoose-query';

/* eslint-disable guard-for-in, no-restricted-syntax */
export function convertFilter(
  params: Record<string, Parameters<typeof convertQueryOperatorToMongooseQuery>[0]>,
) {
  let filter = {};

  for (const key in params) {
    filter = {
      ...filter,
      [key]: convertQueryOperatorToMongooseQuery(params[key]),
    };
  }

  return filter;
}
