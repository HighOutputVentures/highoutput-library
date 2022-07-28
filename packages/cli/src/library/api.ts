/* eslint-disable no-console */
import axios from 'axios';
import withQuery from 'with-query';

const agent = axios.create({
  baseURL: 'http://hovcli.highoutput.io',
  headers: {
    'Content-type': 'application/json;charset=UTF-8',
    APIToken: `${process.env.HOVCLI_TOKEN}`,
  },
});

// @deprecated

export default {
  action: {
    async find(params: {
      body: Record<string, unknown>;
      module: string;
    }) {
      return agent({
        method: 'GET',
        url: `/${params.module}${(params.body.id) ? `/${params.body.id}` : ''}`,
        timeout: 3600000,
      });
    },

    async logs(params: {
      id: string;
      tail?: boolean;
      lines?: number;
      module: string;
    }) {
      return agent({
        method: 'GET',
        url: withQuery(`/${params.module}/${params.id}/logs`, {
          tail: params.tail,
          lines: params.lines,
        }),
        timeout: 3600000,
      });
    },

    async create(params: {
      body: Record<string, unknown>;
      module: string;
    }) {
      return agent({
        method: 'POST',
        url: `/${params.module}`,
        data: params.body,
        timeout: 3600000,
      });
    },

    async update(params: {
      id: string;
      body: Record<string, unknown>;
      module: string;
    }) {
      return agent({
        method: 'PATCH',
        url: `/${params.module}/${params.id}`,
        data: params.body,
        timeout: 3600000,
      });
    },

    async delete(params: {
      body: Record<string, unknown>;
      module: string;
    }) {
      return agent({
        method: 'DELETE',
        url: `/${params.module}/${params.body.id}`,
        timeout: 3600000,
      });
    },
  },
};
