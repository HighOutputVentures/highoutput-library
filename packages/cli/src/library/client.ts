import { ObjectID, Resource, ResourceType } from '../types';
import fetch from 'node-fetch';
import AppError from '@highoutput/error';
import pluralize from 'pluralize';
import { API_BASE_URL, API_TOKEN } from './contants';
import R from 'ramda';
import { URL } from 'url';
import assert from 'assert';

function deserializeResource(resource: any): Resource {
  let result = resource;

  if (typeof resource.id === 'string') {
    result = {
      ...result,
      id: ObjectID.from(resource.id),
    };
  }

  for (const field of ['dateTimeCreated', 'dateTimeUpdated']) {
    const value = result[field];
    if (typeof value === 'string') {
      result = {
        ...result,
        [field]: new Date(value),
      };
    }
  }

  return result;
}

async function send(path: string, options: Parameters<typeof fetch>[1] & { query?: Record<string, string> }): Promise<any> {
  const url = new URL(path, API_BASE_URL);
  url.search = new URLSearchParams(options.query || {}).toString();

  const response = await fetch(url.toString(), R.mergeDeepRight(options || {}, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_TOKEN}`,
    },
  }) as never);

  if (response.status >= 400) {
    throw new AppError('API_ERROR', await response.text(), {
      status: response.status
    });
  }

  assert(response.status >= 200 && response.status < 300, 'unexpected status');

  if (response.headers.get('content-type')!.includes('application/json')) {
    return response.json();
  }

  return response.text();
}

export async function createOrUpdate(params: {
  type: ResourceType,
  id: ObjectID,
  body: Record<string, unknown>,
}): Promise<Resource> {
  const body = await send(`${pluralize(params.type)}/${params.id.toString()}`, {
    body: JSON.stringify(params.body),
    method: 'PUT',
  });
  
  return deserializeResource(body);
}

export async function find(params: {
  type: ResourceType,
  id: ObjectID,
  query?: Record<string, string>,
}): Promise<Resource | null> {
  const body = await send(`${pluralize(params.type)}/${params.id.toString()}`, {
    method: 'GET',
    query: params.query,
  });

  return deserializeResource(body);
}

export async function attribute<T = string>(params: {
  type: ResourceType,
  id: ObjectID,
  name: string,
  query?: Record<string, string>,
}): Promise<T | null> {
  const body = await send(`${pluralize(params.type)}/${params.id.toString()}/${params.name}`, {
    method: 'GET',
    query: params.query,
  });

  return body;
}

export async function list(params: {
  type: ResourceType,
}): Promise<Resource[]> {
  const body = await send(pluralize(params.type), {
    method: 'GET',
  });

  return R.map(deserializeResource, body);
}

export async function update(params: {
  type: ResourceType,
  id: ObjectID,
  body: Record<string, unknown>,
}): Promise<Resource> {
  const body = await send(`${pluralize(params.type)}/${params.id.toString()}`, {
    body: JSON.stringify(params.body),
    method: 'PATCH',
  });

  return deserializeResource(body);
}

export async function deploy(params: {
  type: ResourceType,
  id: ObjectID,
  body: Record<string, unknown>,
}) {
  const body = await send(`${pluralize(params.type)}/${params.id.toString()}:deploy`, {
    body: JSON.stringify(params.body),
    method: 'POST',
  });

  return deserializeResource(body);
}

export async function remove(params: {
  type: ResourceType,
  id: ObjectID,
}): Promise<Resource> {
  const body = await send(`${pluralize(params.type)}/${params.id.toString()}`, {
    method: 'DELETE',
  });

  return deserializeResource(body);
}
