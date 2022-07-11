import { Repository } from '@highoutput/repository';
import { ObjectId } from '@highoutput/object-id';
import R from 'ramda';
import { FilterQuery } from 'mongoose';

type Node = {
  id: ObjectId;
}

export async function retrievePage<
  TNode extends Node = Node,
  TDocument extends Node = Node,
>(
  repository: Repository<TDocument>,
  params: {
    first?: number | null;
    after?: Buffer | null;
    filter?: FilterQuery<TDocument>;
  },
  options: {
    cursorKey?: string;
    sortDirection?: 'ASC' | 'DESC';
    transform?: (document: TDocument) => TNode | Promise<TNode>;
    totalCount?: boolean;
  } = {},
): Promise<{
  totalCount: number;
  edges: {
    node: TNode;
    cursor: Buffer;
  }[];
  pageInfo: {
    hasNextPage: boolean;
    endCursor: Buffer | null;
  }
}> {
  const transform = options.transform || R.identity;

  const sortDirection = options.sortDirection === 'ASC' ? 1 : -1;

  const cursorKey = options.cursorKey || 'cursor';

  const limit = params.first || 1000;

  const filter: FilterQuery<TDocument | null> = params.filter || {};

  let totalCount = 0;

  // if (R.isNil(options.totalCount) || options.totalCount) {
  //   totalCount = await repository.count(filter);
  // }

  const cursorCriteria = (
    field: Buffer,
  ): {
    [key: string]: Buffer;
  } => ({
    [sortDirection === 1 ? '$gt' : '$lt']: field,
  });

  const addCursorFilter = (
    initialFilter: FilterQuery<TDocument>,
    after: Buffer,
  ): FilterQuery<null> => {
    if (initialFilter.$and) {
      return {
        $and: [
          ...(initialFilter.$and as never),
          { [cursorKey]: cursorCriteria(after) },
        ],
      } as never;
    }

    return {
      ...initialFilter,
      [cursorKey]: cursorCriteria(after),
    } as never;
  };

  let query = R.clone(filter);

  if (params.after) {
    query = addCursorFilter(filter, params.after);
  }

  console.log(query);

  const sort: Record<string, 1 | -1> = { [cursorKey]: sortDirection };

  const documents: TDocument[] = await repository.find(query, {
    sort, limit: limit + 1
  });

  const getCursor = R.path<Buffer>(cursorKey.split('.'));

  const hasNextPage = documents.length === limit + 1;
  const nodes = hasNextPage ? documents.slice(0, -1) : documents;

  const edges = await Promise.all(
    R.map<TDocument, Promise<{ node: TNode; cursor: Buffer }>>(
      async (item) => ({
        node: (await transform(item as never)) as TNode,
        cursor: getCursor(item) as Buffer,
      }),
    )(nodes),
  );

  const endCursor =
    edges.length > 0
      ? R.prop('cursor')(R.last(edges) as { cursor: Buffer })
      : null;

  return {
    totalCount,
    edges,
    pageInfo: {
      endCursor,
      hasNextPage,
    },
  };
}